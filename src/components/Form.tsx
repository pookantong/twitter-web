import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePosts from "@/hooks/usePosts";
import usePost from "@/hooks/usePost";

import Avatar from "./Avatar";
import Button from "./Button";
import Image from "next/image";
import Cookies from "js-cookie";

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePost } = usePost(postId as string);

  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 4) {
      toast.error("file must be less than 4");
      setFiles([]);
    }
    else if (selectedFiles) {
      const selectedFileArray = Array.from(selectedFiles);
      setFiles(selectedFileArray);
    }
  };
  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("body", body);

      files.forEach((file) => {
        formData.append(`files`, file);
      });

      const token = Cookies.get("authToken");
      
      const url = isComment
        ? `http://localhost:8000/comment/${postId}`
        : "http://localhost:8000/post";

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Tweet created");
      setBody("");
      setFiles([]);
      mutatePost();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [body, isComment, postId, files, mutatePost]);

  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      {currentUser ? (
        <div className="flex flex-row gap-4">
          <div>
            <Avatar username={currentUser?.username} />
          </div>
          <div className="w-full">
            <textarea
              disabled={isLoading}
              onChange={(event) => setBody(event.target.value)}
              value={body}
              className="
                disabled:opacity-80
                peer
                resize-none 
                mt-3 
                w-full 
                bg-black 
                ring-0 
                outline-none 
                text-[20px] 
                placeholder-neutral-500 
                text-white
              "
              placeholder={placeholder}
            />
            <hr
              className="
                opacity-0 
                peer-focus:opacity-100 
                h-[1px] 
                w-full 
                border-neutral-800 
                transition"
            />
            <div className="flex-wrap mt-3 gap-3">
              <div className="grid grid-cols-2 gap-3">
                {files.map((file: File, index: number) => (
                  <div key={index}>
                    <Image
                      height={480}
                      width={480}
                      alt={""}
                      src={URL.createObjectURL(file)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5"></div>
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="items-center space-x-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50">
                <FontAwesomeIcon icon={faPaperclip} /> Attach
                <input
                  type="file"
                  id="file-input"
                  accept=".jpg, .jpeg, .png, .gif"
                  multiple
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />
              </span>
            </label >
            <div className="mt-4 flex flex-row justify-end">
              <Button
                disabled={isLoading || !body && files.length == 0}
                onClick={onSubmit}
                label="Tweet"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h1 className="text-white text-2xl text-center mb-4 font-bold">
            Welcome to Twitter
          </h1>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button label="Login" onClick={loginModal.onOpen} />
            <Button label="Register" onClick={registerModal.onOpen} secondary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
