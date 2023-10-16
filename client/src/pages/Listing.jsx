import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use(Navigation);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingid}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingid]);
  return (
    <main>
      {loading && <p className=" text-center my-7 text-2xl">loading ...</p>}
      {error && (
        <p className=" text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !error && !loading && (
        <Swiper navigation>
          {listing.imageUrls.map((img) => (
            <SwiperSlide key={img}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${img}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </main>
  );
}
