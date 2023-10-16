import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploaderror] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingDeleteError, SetListingDeleteError] = useState(false);
  const [showListingDeleteError, setShowListingDeleteError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploaderror(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleImageSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json(res);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart);
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json(res);
      if (data.success === false) {
        console.log(data.message);
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setDeleteSuccess(true);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    } finally {
      setDeleteSuccess(false);
    }
  };

  const handleSignout = async () => {
    dispatch(signoutUserStart());
    try {
      const res = await fetch("api/auth/signout");
      const data = await res.json();
      if (data.state === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess());
    } catch (error) {
      dispatch(signoutUserFailure(error));
    }
  };

  const handleShowListings = async () => {
    setShowListingsError(false);
    try {
      const listings = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await listings.json();
      if (data.status === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (id) => {
    SetListingDeleteError(false);
    setShowListingDeleteError(false);
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === "false") {
        SetListingDeleteError(true);
        setShowListingDeleteError(true);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
      SetListingDeleteError(false);
      setShowListingDeleteError(false);
    } catch (error) {
      SetListingDeleteError(error.message);
      setShowListingDeleteError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold my-7 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleImageSelect}
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className=" rounded-full h-24 w-24 self-center object-cover mt-2 cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className=" self-center">
          {fileUploadError ? (
            <span className=" text-center text-red-700">
              Error uploading image (must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className=" text-green-700">
              Image successfully uploaded.
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          defaultValue={currentUser.username}
          placeholder="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          defaultValue={currentUser.email}
          placeholder="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          onSubmit={handleSubmit}
          className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          className=" bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          disabled={deleteSuccess}
          onClick={handleDeleteUser}
          className=" text-red-700 cursor-pointer"
        >
          {" "}
          {deleteSuccess ? "Deleting user ..." : "Delete user"}
        </span>
        <span onClick={handleSignout} className=" text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className=" text-red-700 mt-5">{error ? error : ""}</p>
      <p className=" text-green-700 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button onClick={handleShowListings} className=" text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing Listings" : ""}
      </p>
      <div className=" flex flex-col gap-4">
        {userListings && userListings.length > 0 && (
          <h1 className=" text-slate-700 text-2xl text-center mt-7 font-semibold">
            Your Listings
          </h1>
        )}
        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex border rounded-lg p-3 justify-between items-center"
            >
              <Link to={`/listings/${listing._id}`}>
                <img
                  className="h-16 w-16 object-contain"
                  src={listing.imageUrls[0]}
                  alt="listing cover image"
                />
              </Link>
              <Link
                className="flex-1 text-slate-700 font-semibold hover:underline truncate gap-4"
                to={`/listings/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className=" text-red-700 uppercase text-sm"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className=" text-green-700 uppercase text-sm">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Profile;
