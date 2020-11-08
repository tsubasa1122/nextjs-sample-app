import * as firebase from 'firebase/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthentication } from '../../hooks/authentication';
import { User } from '../../models/User';
import Layout from '../../components/Layout';

type Query = {
  uid: string;
};

export default function UserShow() {
  const [pageUser, setPageUser] = useState<User>(null);
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const query = router.query as Query;
  const { user } = useAuthentication();

  useEffect(() => {
    if (query.uid === undefined) {
      return;
    }
    async function loadUser() {
      const doc = await firebase
        .firestore()
        .collection('users')
        .doc(query.uid)
        .get();
      if (!doc.exists) {
        return;
      }
      const gotUser = doc.data() as User;
      gotUser.uid = doc.id;
      setPageUser(gotUser);
    }
    loadUser();
  }, [query.uid]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSending(true);

    await firebase.firestore().collection('questions').add({
      senderUid: user.uid,
      receiverUid: pageUser.uid,
      body,
      isReplied: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setIsSending(false);
    setBody('');
    toast.success('質問を送信しました。', {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  return (
    <Layout>
      {pageUser && user && (
        <div className="text-center">
          <h1 className="h4">{pageUser.name}さんのページ</h1>
          <div className="m-5">{pageUser.name}さんに質問しよう</div>
          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-6">
              {pageUser.uid === user.uid ? (
                <div>自分には送信出来ません。</div>
              ) : (
                <form onSubmit={onSubmit}>
                  <textarea
                    className="form-control"
                    placeholder="おげんきですか？"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  ></textarea>
                  <div className="m-3">
                    {isSending ? (
                      <div
                        className="spinner-border text-secondary"
                        role="status"
                      ></div>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        質問を送信する
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
