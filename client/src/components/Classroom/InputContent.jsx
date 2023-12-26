import { Button, Input, Space, message } from "antd";
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PageTitleSmall from "../global/PageTitleSmall";
import { GiCancel } from "react-icons/gi";
import { BsFillImageFill, BsFillSendFill } from "react-icons/bs";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase-config";
import { useAuth } from "../../contexts/AuthContext";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
const InputContent = () => {
  const [value, setValue] = useState("");
  const fileInput = useRef(null);
  const [selectFile, setSelectFile] = useState("");
  const isContentEmptyOrWhitespace = /^\s*$|^<p><br><\/p>$/i.test(value);

  const currentUser = useSelector((state) => state.user);
  const { classCode } = useParams();

  const sendPost = async () => {
    const docRef = await addDoc(collection(db, "posts"), {
      id: currentUser[0].memberID || currentUser[0].teacherID,
      userName: currentUser[0].memberName || currentUser[0].teacherName,
      email: currentUser[0].memberEmail || currentUser[0].memberEmail,
      priority: 0,
      text: value,
      subjectGroupID: classCode,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectFile) {
      await uploadString(imageRef, selectFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    message.success("Bạn đã đăng bài viết thành công");
    setValue("");
    setSelectFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectFile(readerEvent.target.result);
    };
  };

  return (
    <div className="w-full">
      <PageTitleSmall title="thảo luận lớp" />
      <div className="">
        <ReactQuill theme="snow" value={value} onChange={setValue} />
        {/* <Input value={value} onChange={(e) => setValue(e.target.value)} /> */}
        <div className="">
          {selectFile && (
            <div className="rounded-md relative w-fit">
              <button
                onClick={() => setSelectFile(null)}
                className=" p-1 rounded-full bg-red-100 text-red-500 absolute top-1 right-3"
              >
                <AiFillCloseCircle />
              </button>
              <img
                src={selectFile}
                alt=""
                className="w-[200px] h-[200px] object-contain rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 my-4">
          <button
            onClick={() => fileInput.current.click()}
            className="ICON bg-yellow-400 text-black"
          >
            <BsFillImageFill />
            Ảnh
            <input
              type="file"
              hidden
              ref={fileInput}
              onChange={addImageToPost}
            />
          </button>
          <button className="ICON bg-red-500 text-white">
            <GiCancel />
            Hủy
          </button>
          <button
            onClick={() => sendPost()}
            className="ICON bg-blur-500 bg-blue-500 text-white disabled:bg-gray-900 "
            disabled={isContentEmptyOrWhitespace}
          >
            <BsFillSendFill />
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputContent;
