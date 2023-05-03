import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  label: string;
  text: string;
  rows?: number;
  setText: (text: string) => void;
}

const Input = ({ label, text, rows, setText}: InputProps) => {
  return (
    <div className={styles.input__wrap}>
      <p>{label}</p>
      <textarea cols={100} rows={rows ?? 3} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
};

export default Input;
