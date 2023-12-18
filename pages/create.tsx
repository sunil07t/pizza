import { useSession } from 'next-auth/react';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { QuantityType } from '../models/QuantityType'; 
import styles from '../styles/Create.module.css';

interface Ingredient {
  name: string;
  quantity: string;
  unit: QuantityType; 
}

const CreatePage = () => {
  const [pizza, setPizza] = useState({
    name: '',
    ingredients: [{ name: '', quantity: '', unit: QuantityType.Milliliter }], 
  });
  const { data: session, status: sessionStatus } = useSession(); 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); 
  const [isSessionLoading, setIsSessionLoading] = useState(true);


  useEffect(() => {
    setIsSessionLoading(sessionStatus === "loading");
    if (sessionStatus === "unauthenticated") {
      router.push('/login');
    }
  }, [sessionStatus, router]);

  const handleIngredientChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const key = name as keyof Ingredient;
    const newIngredients = [...pizza.ingredients];
    if (key === "unit") {
      newIngredients[index][key] = value as QuantityType;
    } else {
      newIngredients[index][key] = value;
    }
    setPizza({ ...pizza, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...pizza.ingredients];
    newIngredients.splice(index, 1);
    setPizza({ ...pizza, ingredients: newIngredients });
  };
  
  const addIngredient = () => {
    setPizza({
      ...pizza,
      ingredients: [...pizza.ingredients, { name: '', quantity: '', unit: QuantityType.Milliliter }],
    });
  };

  const handleBackClick = () => {
    router.push('/'); 
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!session || !session.user?.email) {
      toast.error('You must be signed in to create a pizza.');
      return;
    }

    setIsLoading(true); 

    if (pizza.name.trim().length < 1) {
        toast.error('Pizza name must be at least 1 characters long.');
        setIsLoading(false);
        return;
    }

    if (pizza.ingredients.length <= 0 ) {
        setIsLoading(false);
        toast.error('Please add ingredients.');
        return;
    }

    for (let ingredient of pizza.ingredients) {
        if (!ingredient.name.trim() || isNaN(Number(ingredient.quantity)) || Number(ingredient.quantity) <= 0) {
            setIsLoading(false);
            toast.error('Invalid ingredient details.');
            return;
        }
    }
  
    const pizzaData = {
      ...pizza,
      createdBy: session.user.email, 
    };
  
    try {
      const response = await fetch('/api/pizzas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pizzaData),
        credentials: 'include', 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create pizza.');
    }
  
      const result = await response.json();
      toast.success('Pizza created successfully!');
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      console.error('Failed to create pizza:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false); 
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

  if (sessionStatus === "authenticated") {
return (
      <div className={styles.container}>
        <button onClick={handleBackClick} className={styles.backButton}>
            Back to Home
          </button>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <input 
            type="text"
            className={styles.inputField}
            value={pizza.name}
            onChange={(e) => setPizza({ ...pizza, name: e.target.value })}
            placeholder="Pizza Name"
          />
          
          {pizza.ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
            <input 
              type="text"
              name="name"
              className={styles.inputField}
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, e)}
              placeholder="Ingredient Name"
            />
            <input 
              type="text"
              name="quantity"
              className={styles.inputField}
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, e)}
              placeholder="Quantity"
            />
            <select
              name="unit"
              value={ingredient.unit}
              className={styles.inputField}
              onChange={(e) => handleIngredientChange(index, e as unknown as ChangeEvent<HTMLInputElement>)}
            >
              {Object.values(QuantityType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button type="button" onClick={() => removeIngredient(index)} className={styles.removeButton}>
            Remove
          </button>
          </div>
        ))}

          <button type="button" onClick={addIngredient} className={styles.addButton}>Add Ingredient</button>
          {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                </div>
            ) : (
                <button type="submit" className={styles.submitButton}>Create Pizza</button>
            )}
        </form>
      </div>
    );
  }

  return null; 
};

export default CreatePage;
