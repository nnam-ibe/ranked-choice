import styles from './visually-hidden.module.css';

export interface VisuallyHiddenProps {
  children: React.ReactNode;
}

export function VisuallyHidden(props: VisuallyHiddenProps) {
  return <span className={styles.visuallyHidden}>{props.children}</span>;
}

export default VisuallyHidden;
