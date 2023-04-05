import styles from './polls-loading.module.css';
export async function PollsLoading() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => {
        return (
          <div className={styles.container} key={index}>
            <div className={`${styles.title} ${styles.content}`}></div>
            <div className={`${styles.description} ${styles.content}`}></div>
          </div>
        );
      })}
    </>
  );
}

<div className={styles.impact}></div>;
