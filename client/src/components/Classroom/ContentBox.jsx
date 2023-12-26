import React, { useRef, useState } from "react";
import user from "../../../src/assets/user.png";
import { BsFillSendPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaRegComment, FaUserShield } from "react-icons/fa6";
import { Dropdown, Input, Menu, message } from "antd";
import moment from "moment-timezone";
import { useAuth } from "../../contexts/AuthContext";
import { AiFillPushpin } from "react-icons/ai";
import comment from "../../assets/comment.png";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase-config";
import { deleteObject, ref } from "firebase/storage";
import FromNow from "../global/FromNow";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  DeleteOutlined,
  PushpinOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { itemsComment, itemsPost } from "../../constants";
import { useSelector } from "react-redux";

const ContentBox = ({ data }) => {
  const inputRef = useRef(null);
  const currentUser = useSelector((state) => state.user);
  const handleMenuPostClick = (e, postId) => {
    if (e.key == 1) {
      console.log("an");
      pinPost(postId);
    } else if (e.key == 4) {
      deletePost(postId);
    }
  };

  const handleMenuCommentClick = (e, postId, commentId) => {
    if (e.key == 1) {
      console.log("an");
      pinPost(postId);
    } else if (e.key == 2) {
      console.log(postId, commentId);
      deleteComment(postId, commentId);
    }
  };

  const deletePost = async (postId) => {
    if (window.confirm("Bạn có muốn xóa bài đăng không?")) {
      await deleteDoc(doc(db, "posts", postId));
      if (postId.data().image) {
        deleteObject(ref(storage, `posts/${postId}/image`));
      }
      message.success("Bạn đã xóa bài đăng thành công");
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (window.confirm("Bạn có muốn xóa bình luận này? ")) {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    }
    message.success("Bạn đã xóa bình luận thành công");
  };

  const sendComment = async (postId) => {
    if (inputRef.current.value === undefined) {
      return;
    } else {
      await addDoc(collection(db, "posts", postId, "comments"), {
        userName: currentUser[0].teacherName || currentUser[0].memberName,
        comment: inputRef.current.value,
        email: currentUser[0].memberEmail || currentUser[0].teacherEmail,
        timestamp: serverTimestamp(),
        userID: currentUser[0].memberID || currentUser[0].teacherID,
      });
      console.log(inputRef.current.value);
      inputRef.current.value = null;
    }

    message.success("Bạn đã thêm bình luận thành công");
  };

  const pinPost = async (postID) => {
    const postRef = doc(db, "posts", postID);

    try {
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const currentPriority = postDoc.data().priority;
        const newPriority = currentPriority === 0 ? 1 : 0;

        await updateDoc(postRef, {
          priority: newPriority,
        });

        message.success("Bạn đã thay đổi trạng thái ghim bài đăng thành công.");
      } else {
        message.error("Bài viết không tồn tại.");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi thay đổi trạng thái ghim bài đăng.");
    }
  };

  const handleSendClick = () => {
    const inputValue = inputRef.current.value;
  };

  const renderHtml = (htmlFromApi) => {
    return { __html: htmlFromApi };
  };

  console.log("data", currentUser);
  return (
    <div className="flex flex-col bg-white rounded-xl mb-5 p-3 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={user} alt="" />
          <div className="flex flex-col">
            <div className="flex gap-3">
              <h1 className="font-semibold ">{data?.userName}</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                <FromNow
                  targetTime={moment
                    .unix(data?.timestamp?.seconds)
                    .tz("Asia/Ho_Chi_Minh")}
                />
              </span>

              {moment
                .unix(data?.timestamp?.seconds)
                .format("DD-MM-YYYY HH:mm:ss")}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {data?.priority === 1 && (
            <div className="ICON_FULL bg-red-100 text-red-500 w-fit">
              <AiFillPushpin />
            </div>
          )}

          {currentUser &&
            currentUser[0] &&
            (currentUser[0].teacherID == data.id ||
              currentUser[0].memberID == data.id) && (
              <Dropdown
                overlay={
                  <Menu onClick={(e) => handleMenuPostClick(e, data.postID)}>
                    {itemsPost.map((item) => (
                      <Menu.Item key={item.key} danger={item.danger}>
                        {item.label}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <div className="bg-gray-100 text-gray-900 p-2 rounded-full hover:bg-gray-300">
                  <BsThreeDotsVertical />
                </div>
              </Dropdown>
            )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="my-2">
        {data.image && (
          // <img
          //   src={data?.image}
          //   alt=""
          //   className="h-auto w-full rounded-lg object-cover"
          // />

          <div className="bg-lime-100 text-green-600 w-1/2 h-[50px] px-4 py-2  rounded-sm border-gray-400 flex items-center justify-center font-semibold text-base">
            <a href={data?.image} className=" w-full h-full">
              File thư mục
            </a>
          </div>
        )}

        <h1
          className="my-4"
          dangerouslySetInnerHTML={renderHtml(data?.text)}
        ></h1>
      </div>

      {/* BÌNH LUẬN */}
      <div className="">
        <div className="font-bold text-xl flex items-center gap-2">
          <img src={comment} alt="" />
          <h1 className="text-sm font-semibold text-blue-600">
            {data?.comments?.length || 0} bình luận
          </h1>
        </div>

        {data.comments &&
          data?.comments.map((item) => (
            <div
              className="mt-3 w-fit ml-5 my-3 flex flex-col"
              key={item?.commentID}
            >
              <div className="flex items-center gap-3 ">
                <img src={user} alt="" />
                <div className="rounded-lg border-purple-300 bg-purple-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-3 items-center">
                      <h1 className="font-semibold">{item?.userName} </h1>
                      {(currentUser[0] &&
                        currentUser[0]?.teacherID == data.id) ||
                        (currentUser[0]?.memberID == data.id && (
                          <div className="p-1 rounded-full bg-lime-100 text-green-600">
                            <FaUserShield />
                          </div>
                        ))}
                      <h4>{data.id + "===" + currentUser[0]?.memberID}</h4>
                    </div>

                    <span className="text-gray-800 font-normal italic">
                      <FromNow
                        targetTime={moment
                          .unix(item?.timestamp?.seconds)
                          .tz("Asia/Ho_Chi_Minh")}
                      />
                    </span>
                  </div>
                  <span className="font-sans italic text=gray-800">
                    {item?.comment}
                  </span>
                </div>

                {(currentUser[0].memberID == item.userID ||
                  currentUser[0].teacherID == item.userID) && (
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={(e) =>
                          handleMenuCommentClick(e, data.postID, item.commentID)
                        }
                      >
                        {itemsComment.map((item) => (
                          <Menu.Item key={item.key} danger={item.danger}>
                            {item.label}
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <div className="p-1 rounded-full bg-gray-300 text-black">
                      <BiDotsHorizontalRounded />
                    </div>
                  </Dropdown>
                )}
              </div>
            </div>
          ))}

        {/* USER COMMENT */}
        <div className="flex items-center gap-3">
          <img
            src="https://s2.coinmarketcap.com/static/img/coins/200x200/5994.png"
            alt=""
            className="w-12 h-12 object-cover rounded-full"
          />
          <div className="relative w-full">
            <input
              ref={inputRef}
              placeholder="Viết bình luận"
              className="bg-gray-50 flex-1 border border-gray-300 text-gray-900 text-sm rounded-full focus-within:ring-blue-500 outline-1 focus-within:border-blue-500  w-full p-2.5  "
            />

            <button
              onClick={() => sendComment(data?.postID)}
              className="absolute right-[6px] top-1 ICON_FULL bg-cyan-100 text-cyan-500"
            >
              <BsFillSendPlusFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentBox;
