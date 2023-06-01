import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, useSearchParams } from "react-router-dom";

function Gigs() {
    const [sort, setSort] = useState("sales");
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const minRef = useRef();
    const maxRef = useRef();

    searchParams.get("cat")
    const { search } = useLocation();

    useEffect(() => {
        const data = newRequest
            .get(
                `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
            )
            .then((res) => {
                return res.data;
            })
    }, [])

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["gigs"],
        queryFn: () =>
            newRequest
                .get(
                    `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
                )
                .then((res) => {
                    return res.data;
                }),
    });

    console.log(data);
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const reSort = (type) => {
        setSort(type);
        setOpen(false);
    };

    useEffect(() => {
        refetch();
    }, [sort]);

    const apply = () => {
        refetch();
    };

    return (
        <div className="gigs">
            <div className="container">
                <span className="breadcrumbs">Liverr > Graphics & Design ></span>
                <h1>{capitalize(searchParams.get("cat").replace("_", " "))}</h1>
                <p>
                    Explore the boundaries of art and technology with Liverr's AI artists
                </p>
                <div className="menu">
                    <div className="left">
                        <span>Budget</span>
                        <input ref={minRef} type="number" placeholder="min" />
                        <input ref={maxRef} type="number" placeholder="max" />
                        <button onClick={apply}>Apply</button>
                    </div>
                    <div className="right">
                        <span className="sortBy">Sort by</span>
                        <span className="sortType">
                            {sort === "sales" ? "Best Selling" : "Newest"}
                        </span>
                        <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
                        {open && (
                            <div className="rightMenu">
                                {sort === "sales" ? (
                                    <span onClick={() => reSort("createdAt")}>Newest</span>
                                ) : (
                                    <span onClick={() => reSort("sales")}>Best Selling</span>
                                )}
                                <span onClick={() => reSort("sales")}>Popular</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="cards">
                    {isLoading
                        ? "loading"
                        : error
                            ? "Something went wrong!"
                            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
                </div>
            </div>
        </div>
    );
}

export default Gigs;
