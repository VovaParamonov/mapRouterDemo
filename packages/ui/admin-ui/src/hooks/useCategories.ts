import { useEffect, useState } from 'react';
import { Category } from '@template_root/catalog';

import { getCategories } from '../api/category';

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedCategories = await getCategories();

      setCategories(fetchedCategories.categories);
    })();

  }, []);

  return {
    categories
  };
};

export default useCategories;