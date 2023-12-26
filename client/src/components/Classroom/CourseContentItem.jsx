import { FileGifOutlined, MenuOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Input, Modal } from "antd";
import InputContent from "./InputContent";
import ContentBox from "./ContentBox";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useParams } from "react-router-dom";
// import animation from '../../assets/Animation-1696603005955.lottie'
const CourseContentItem = ({ data }) => {
 

  const [posts, setPosts] = useState([]);
  const { classCode } = useParams();
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const unsubscribePosts = onSnapshot(
      query(
        postsRef,
        where("subjectGroupID", "==", classCode),
        orderBy("priority", "desc"),
        orderBy("timestamp", "desc")
      ),
      (querySnapshot) => {
        const postsData = querySnapshot.docs.map((doc) => {
          const post = { postID: doc.id, ...doc.data() };

          // Lấy dữ liệu bình luận cho mỗi bài viết
          const commentsRef = collection(db, "posts", doc.id, "comments");
          onSnapshot(
            query(commentsRef, orderBy("timestamp", "asc")),
            (commentSnapshot) => {
              const commentsData = commentSnapshot.docs.map((commentDoc) => ({
                commentID: commentDoc.id,
                ...commentDoc.data(),
              }));
              post.comments = commentsData;
              setPosts((prevData) => {
                const updatedData = prevData.filter(
                  (item) => item.postID !== doc.id
                );
                return [...updatedData, post];
              });
            }
          );

          return post;
        });

        setPosts(postsData);
      }
    );

    return () => {
      unsubscribePosts();
    };
  }, []);

  console.log(posts, "ddd");

  const [active, setActive] = useState({ modal: false });

  const handleActiveModal = () => {
    setActive({ ...active, modal: true });
  };

  const handleCloseModal = () => {
    setActive({ ...active, modal: false });
  };
  return (
    <div className="flex flex-col w-full bg-gray-200 p-2">
      <div className="w-2/3">
        <div className="bg-white p-2  ">
          <InputContent />
        </div>
        <div className="w-full mt-4">
          {posts.length > 0 && posts.map((item) => <ContentBox data={item} />)}
        </div>

        <div className="w-1/3">
          {/* <img src={animation} alt="" /> */}
        </div>
      </div>

      <Modal title="CC" onCancel={handleCloseModal} open={active.modal}></Modal>
    </div>
  );
};

export default CourseContentItem;
