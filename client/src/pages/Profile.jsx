import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
    getStorage,
    uploadBytesResumable,
    ref,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const { currentUser } = useSelector((state) => state.user);
    const [imagePercentage, setImagePercentage] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);

    const handleFileUpload = (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Handle progress
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercentage(Math.round(progress));
            },
            (error) => {
                // Handle error
                console.error("Error during upload:", error);
                setImageError(true);
            },
            () => {
                // Handle success and get download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData((prevData) => ({
                        ...prevData,
                        profileImg: downloadURL,
                    }));
                    setImageError(false); // Reset error state
                });
            }
        );
    };

    return (
        <div className="p-3 max-width-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form action="" className="flex flex-col gap-4 max-w-lg mx-auto">
                <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <img
                    src={formData.profileImg || currentUser.profileImg}
                    alt="profile"
                    className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
                    onClick={() => fileRef.current.click()}
                />
                <p className="text-sm self-center">
                    {imageError ? (
                        <span className="text-red-700">
                            Error uploading image
                        </span>
                    ) : imagePercentage > 0 && imagePercentage < 100 ? (
                        <span className="text-slate-700">
                            Uploading image {imagePercentage}%
                        </span>
                    ) : imagePercentage === 100 ? (
                        <span className="text-green-700">
                            Image uploaded successfully
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <input
                    defaultValue={currentUser.username}
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="bg-slate-100 p-3 rounded-lg"
                />
                <input
                    defaultValue={currentUser.email}
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-slate-100 p-3 rounded-lg"
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="bg-slate-100 p-3 rounded-lg"
                />
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
                    Update
                </button>
                <div className="flex justify-between  mt-5">
                    <span className="text-red-700 cursor-pointer">
                        Delete Account
                    </span>
                    <span className="text-red-700 cursor-pointer">
                        Sign out
                    </span>
                </div>
            </form>
        </div>
    );
}
