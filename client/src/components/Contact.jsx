import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landload, setLandload] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandLoad = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandload(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLoad();
  }, [listing.userRef]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landload && (
        <div className="flex flex-col gap-2">
          <p>
            Contact &nbsp;
            <span className=" font-semibold">{landload.username}</span> for
            <span className=" font-semibold">
              {" "}
              {listing.name.toLowerCase()}
            </span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            placeholder="Enter message"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleMessage}
          ></textarea>
          <Link
            className=" bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landload.email}?subject=Regaring ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

// Define your propTypes below the component
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired, // define the shape according to expected value
  }).isRequired,
};
