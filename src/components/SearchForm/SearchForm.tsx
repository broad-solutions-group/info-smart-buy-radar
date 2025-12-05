'use client';

import { FormEvent } from 'react';
import styles from './SearchForm.module.css';

export default function SearchForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form className={styles.newsletterForm} onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="search"
        placeholder="Enter search keywords"
        className={styles.emailInput}
      />
      <button type="submit" className={styles.subscribeBtn}>
        Search
      </button>
    </form>
  );
}

