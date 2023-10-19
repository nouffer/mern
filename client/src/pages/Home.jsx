import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import ListinItem from "../components/ListinItem";

function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  SwiperCore.use(Navigation);
  console.log(saleListing);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListing();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className=" text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className=" text-slate-500">perfect</span> <br />
          place with ease
        </h1>
        <div className=" text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the best place to find your next perfect place to
          live. <br />
          We have a wide range of properties for you tochoose from.
        </div>
        <Link
          className=" text-sx sm:text-sm text-blue-800 font-bold hover:underline"
          to={"search"}
        >
          Lets get started...
        </Link>
      </div>
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((offer) => (
            <SwiperSlide key={offer._id}>
              <div
                style={{
                  background: `url(${offer.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6l mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className=" m-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className=" text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((offer) => (
                <ListinItem listing={offer} key={offer._id}></ListinItem>
              ))}
            </div>
          </div>
        )}

        {/* rent */}
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className=" m-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places rent
              </h2>
              <Link
                className=" text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more places for rentals
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((rent) => (
                <ListinItem listing={rent} key={rent._id}></ListinItem>
              ))}
            </div>
          </div>
        )}

        {/* sale */}
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className=" m-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places sale
              </h2>
              <Link
                className=" text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListing.map((sale) => (
                <ListinItem listing={sale} key={sale._id}></ListinItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
