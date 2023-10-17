import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedRooms: 1,
    bathRooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formSubmiError, setFormSubmitError] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed ( 2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_change",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleFormChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setFormSubmitError("You must upload at least one image");
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        return setFormSubmitError(
          "discounted price must be lower than regular price"
        );
      }
      setFormSubmitLoading(true);
      setFormSubmitError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      setFormSubmitLoading(false);
      const data = await res.json();
      if (data.success === false) {
        setFormSubmitError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setFormSubmitError(error.message);
      setFormSubmitLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className=" flex flex-col gap-4 flex-1">
          <input
            onChange={handleFormChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className=" border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            onChange={handleFormChange}
            value={formData.description}
            type="textarea"
            placeholder="Description"
            className=" border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            onChange={handleFormChange}
            value={formData.address}
            type="text"
            placeholder="Address"
            className=" border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.type === "sale"}
                type="checkbox"
                className="w-5"
                id="sale"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.type === "rent"}
                type="checkbox"
                className="w-5"
                id="rent"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.parking}
                type="checkbox"
                className="w-5"
                id="parking"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.furnished}
                type="checkbox"
                className="w-5"
                id="furnished"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.offer}
                type="checkbox"
                className="w-5"
                id="offer"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleFormChange}
                value={formData.bedRooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedRooms"
                min="1"
                max="10"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleFormChange}
                value={formData.bathRooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathRooms"
                min="1"
                max="10"
              />
              <p>Bath</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleFormChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                max="1000000"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className=" text-xs">$ / month</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleFormChange}
                  value={formData.descountedPrice}
                  className="p-2 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="1000000"
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className=" text-xs">$ / month</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className=" font-normal text-gray-600 ml-2">
              first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-gray-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading ..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className=" text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className=" flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-3 text-red-700 rounded uppercase hover:opacity-95 disabled:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={formSubmitLoading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {formSubmitLoading ? "Creating ..." : "Create Listing"}
          </button>
          {formSubmiError && (
            <p className=" text-red-700 text-sm">{formSubmiError}</p>
          )}
        </div>
      </form>
    </main>
  );
}
