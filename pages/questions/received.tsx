import * as firebase from 'firebase/app';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useAuthentication } from '../../hooks/authentication';
import { Question } from '../../models/Question';
import Layout from '../../components/Layout';

export default function QuestionReceived() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPaginationFinished, setIsPaginationFinished] = useState(false);
  const { user } = useAuthentication();
  const scrollContainerRef = useRef(null);

  function createBaseQuery() {
    return firebase
      .firestore()
      .collection('questions')
      .where('receiverUid', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(10);
  }

  function appendQuestions(
    snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) {
    const gotQuestions = snapshot.docs.map((doc) => {
      const question = doc.data() as Question;
      question.id = doc.id;
      return question;
    });

    setQuestions(questions.concat(gotQuestions));
  }

  async function loadQuestions() {
    const snapshot = await createBaseQuery().get();

    if (snapshot.empty) {
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapshot);
  }

  async function loadNextQuestions() {
    if (questions.length === 0) {
      return;
    }

    const lastQuestion = questions[questions.length - 1];
    const snapshot = await createBaseQuery()
      .startAfter(lastQuestion.createdAt)
      .get();

    if (snapshot.empty) {
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapshot);
  }

  function onScroll() {
    if (isPaginationFinished) {
      return;
    }

    const container = scrollContainerRef.current;
    if (container === null) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.top + rect.height > window.innerHeight) {
      return;
    }

    loadNextQuestions();
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [questions, scrollContainerRef.current, isPaginationFinished]);

  useEffect(() => {
    if (!process.browser) {
      return;
    }
    if (user === null) {
      return;
    }

    loadQuestions();
  }, [process.browser, user]);

  return (
    <Layout>
      <h1 className="h4"></h1>

      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
          {questions.map((question) => (
            <Link
              href="/questions/[id]"
              as={`/questions/${question.id}`}
              key={question.id}
            >
              <div className="card my-3" key={question.id}>
                <div className="card-body">
                  <div className="text-truncate">{question.body}</div>
                  <div className="text-muted text-right">
                    <small>
                      {dayjs(question.createdAt.toDate()).format(
                        'YYYY/MM/DD HH:mm'
                      )}
                    </small>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
