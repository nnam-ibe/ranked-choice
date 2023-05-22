import { AppLink } from '../components/app-link/app-link';
import { PollsList, PollsLoading } from '../components/polls-list';
import styles from './page.module.css';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div id="hero" className="rounded">
            <div className="text-container">
              <h2>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>Polls Polls Polls</span>
              </h2>
              <AppLink href={`/poll/create`}>Create your poll</AppLink>
            </div>
          </div>

          <div id="middle-content">
            <div id="learning-materials" className="rounded shadow">
              <h2>Open Polls</h2>
              <Suspense fallback={<PollsLoading />}>
                {/* @ts-expect-error Server Component */}
                <PollsList options={{ closed: 'false' }} />
              </Suspense>
            </div>
            <div id="learning-materials" className="rounded shadow">
              <h2>Closed Polls</h2>
              <Suspense fallback={<PollsLoading />}>
                {/* @ts-expect-error Server Component */}
                <PollsList options={{ closed: 'true' }} />
              </Suspense>
            </div>
          </div>

          <p id="love">
            Carefully crafted without
            <svg
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
