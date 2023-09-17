import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import Cookies from "js-cookie";

import Input from "../Input";
import Modal from "../Modal";
import ImageUpload from "../ImageUpload";
import Image from "next/image";

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const editModal = useEditModal();

  const [profileImage, setProfileImage] = useState(false);
  const [coverImage, setCoverImage] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [bio, setBio] = useState("");

  const onImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: "profile" | "cover"
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const selectedFileArray = Array.from(selectedFiles);
      console.log(imageType)
      if (imageType === "profile") {
        setFiles([selectedFileArray[0], ...files.slice(1)]); // Set profile image as the first element
        setProfileImage(true);
      } else if (imageType === "cover") {
        if (profileImage) {
          setFiles([files[0], selectedFileArray[0], ...files.slice(2)]); // Set cover image as the second element
        } else {
          setFiles([selectedFileArray[0], ...files.slice(1)]); // Set cover image as the first element if no profile image is selected
        }
        setCoverImage(true);
      }
    }

    console.log(profileImage, coverImage, files.length);
  };

  useEffect(() => {
    setProfileName(currentUser?.profileName);
    setBio(currentUser?.bio);
  }, [currentUser?.profileName, currentUser?.bio]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append(`image`, file);
      });
      formData.append("bio", bio);
      formData.append("profileName", profileName);

      const token = Cookies.get("authToken");

      const url = `http://localhost:8000/user?profileImage=${profileImage}&coverImage=${coverImage}`;

      await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Updated");
      window.location.reload();
      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [editModal, profileName, bio, profileImage, coverImage]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <label htmlFor="profile-input" className="cursor-pointer">
        <span className="items-center space-x-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50">
          Profile Image
          <input
            type="file"
            id="profile-input"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={(e) => onImageChange(e, "profile")}
            style={{ display: "none" }}
          />
        </span>
      </label>

      <label htmlFor="cover-input" className="cursor-pointer">
        <span className="items-center space-x-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50">
          Cover Image
          <input
            type="file"
            id="cover-input"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={(e) => onImageChange(e, "cover")}
            style={{ display: "none" }}
          />
        </span>
      </label>

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
      <Input
        placeholder="Name"
        onChange={(e) => setProfileName(e.target.value)}
        value={profileName}
        disabled={isLoading}
      />
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
