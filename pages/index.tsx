import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Pizza {
  _id: string;
  name: string;
  ingredients: Ingredient[];
}

const ListPage = () => {
  const { data: session, status: sessionStatus } = useSession(); 
  const router = useRouter(); 
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSessionLoading, setIsSessionLoading] = useState(true);


  // Fetch Pizzas
  const fetchPizzas = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/pizzas?page=${page}`);
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setPizzas((prevPizzas) => [...prevPizzas, ...data]);
      setHasMore(data.length === 20); 
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Failed to load pizzas:', error);
    } finally {
      setLoading(false);
    }
  };

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedPizza(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsSessionLoading(sessionStatus === "loading");
    if (sessionStatus === "authenticated") {
      fetchPizzas();
    }
  }, [sessionStatus]); 

  const handleCreateClick = () => {
    router.push('/create'); 
  };

  const handlePizzaClick = (pizza: Pizza) => {
    setSelectedPizza(pizza);
  };

  const handleClosePopup = () => {
    setSelectedPizza(null);
  };

  const handelSingIn = () => {
    router.push('/login'); 
  };

  const handleDelete = async (pizzaId: string) => {
    try {
      const response = await fetch(`/api/pizzas/delete/${pizzaId}`, { method: 'PUT' });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const updatedPizzas = pizzas.filter(pizza => pizza._id !== pizzaId);
      setPizzas(updatedPizzas);
      setSelectedPizza(null);
    } catch (error) {
      console.error('Failed to delete pizza:', error);
    }
  };
  
  if (isSessionLoading) {
    return (
      <div className={styles.loadingBg}>
      <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    ) 
  }

  return (
    <div className={styles.back}>
    <div>
      {!session && (
        <div onClick={handelSingIn} className={styles.signInMessage}>Please sign in to see your pizzas!</div>
      )}
       {session && ( 
      <div>
      <div>
      <button onClick={handleCreateClick} className={styles.createButton}>
        Create Pizza
      </button>
      <h2 className={styles.savedPizzasTitle}>Saved Pizzas</h2>
      <div className={styles.cardContainer}>
        {pizzas.map((pizza) => (
          <div key={pizza._id} className={styles.pizzaCard} onClick={() => handlePizzaClick(pizza)} >
          <h3 className={styles.pizzaName}>
            {pizza.name}
          </h3>
        </div>
        ))}
      </div>

      {selectedPizza && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent} ref={popupRef}>
            <button onClick={handleClosePopup} className={styles.closeButton}>X</button>
            <h2 className={styles.pizzaName}>{selectedPizza.name}</h2>
            <h4 className={styles.ingredientTitle}>Ingridents</h4>
            <ul className={styles.ingredientList}>
              {selectedPizza.ingredients.map((ingredient, index) => (
                <li key={index} className={styles.ingredientItem}>
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
            <button onClick={() => handleDelete(selectedPizza._id)} className={styles.deletePizzaButton}>
              Delete Pizza
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      {hasMore && !loading && (
        <button onClick={fetchPizzas} className={styles.loadMoreButton}>
          Load More
        </button>
      )}
    </div>
      </div>
    )}
    </div>
    </div>
  );
};

export default ListPage;
