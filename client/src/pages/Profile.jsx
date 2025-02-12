import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
    getStorage,
    uploadBytesResumable,
    ref,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOut
} from "../redux/user/userSlice";
("react-router-dom");

export default function Profile() {
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [imagePercentage, setImagePercentage] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();

    const [updateSuccess, setUpdateSuccess] = useState(false);

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

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success == false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error));
        }
    };

    const handleDeleteAccount = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success == false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess());
        } catch (error) {
            dispatch(deleteUserFailure(error));
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch(`/api/auth/signout`);
            dispatch(signOut());
        } catch (error) {
            console.log(error);
            
        }
    };

    return (
        <div className="p-3 max-width-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form
                onSubmit={handleSubmit}
                action=""
                className="flex flex-col gap-4 max-w-lg mx-auto"
            >
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
                    onChange={handleChange}
                />
                <input
                    defaultValue={currentUser.email}
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-slate-100 p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="bg-slate-100 p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
                    type="submit"
                    onSubmit={handleSubmit}
                >
                    {loading ? "Loading..." : "Update"}
                </button>
                <div className="flex justify-between  mt-5">
                    <span
                        onClick={handleDeleteAccount}
                        className="text-red-700 cursor-pointer"
                    >
                        Delete Account
                    </span>
                    <span
                        onClick={handleSignOut}
                        className="text-red-700 cursor-pointer"
                    >
                        Sign out
                    </span>
                </div>
                <p className="text-red-700 mt-1 text-center">
                    {error && "something went wrong!"}
                </p>
                <p className="text-green-600 mt-1 text-center">
                    {updateSuccess && "User is updated successfully!"}
                </p>
            </form>
        </div>
    );
}
