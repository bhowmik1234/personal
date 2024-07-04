import React, { useState, useEffect } from "react";
import { GrRadial } from "react-icons/gr";
import { GrRadialSelected } from "react-icons/gr";
import Pay from "./Pay.jsx";
import api from "../utils/api.js"

const Reqpay = () => {
  const [paytoggle, setPaytoggle] = useState(false);
  const [reqtoggle, setReqtoggle] = useState(true);
  const [data, setData] = useState([]);
  const [paythrough, setPaythrough] = useState("metamask");
  const [upi, setUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setKeyword] = useState(""); 

  const reqcloseHandler = () => {
    setReqtoggle(!reqtoggle);
  };

  const reqHandler = () => {
    try {
      (async () => {
        const res = await api.post("/money-transfer/money-requested", {
          receiver: upi,
          amount: amount,
          reason: reason
        });
        console.log(res.data);
        setReqtoggle(!reqtoggle);
      })();
    } catch (error) {
      console.log(error);
    }
  };

  const payHandler = () => {
    setPaytoggle(true);
  };
  const closeHandler = () => {
    setPaytoggle(false);
  };
  const paythroughHandler = (type) => {
    setPaythrough(type);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/money-transfer/all-request-money");
        const a = await res.data;
        setData(a.money.requests);
        console.log(a);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      <p className="text-lg text-green-500">
        <strong>OUTGOING REQUESTS</strong>
      </p>
      <br></br>
      <button
        onClick={reqcloseHandler}
        className=" rounded-full p-5 bg-icon text-black w-[200px] h-[60px]"
      >
        Request
      </button>
      <br></br>
      <br></br>

      <div className="flex justify-between items-center w-full border-2 border-zinc-400 rounded-lg bg-boxbg p-8">
        <p className="text-green-400 flex items-center font-bold text-2xl">
          +700
        </p>
        <div className=" flex flex-col justify-center">
          <p className="text-sm text-stone-400 inset-x-0 bottom-0 font-medium">
            Name
          </p>
          <p className="text-sm text-stone-400 inset-x-0 bottom-0 font-medium">
            7066661607@upi
          </p>
        </div>
        <button
          onClick={payHandler}
          className=" rounded-full p-5 bg-icon text-black w-24 h-full"
        >
          status
        </button>
      </div>

      <br></br>
      <p className="text-lg text-green-500">
        <strong>INCOMING REQUESTS</strong>
      </p>
      <br></br>
      {data.length == 0 ? (
        <p className=" text-xl text-gray-400">No data found.</p>
      ) : (
        data.map((e) => (
          <div
            key={e._id}
            className="flex justify-between items-center w-full border-2 border-zinc-400 rounded-lg bg-boxbg p-8"
          >
            <p className="text-red-400 flex items-center font-bold text-2xl">
              -{e.amount}
            </p>
            <div className=" flex flex-col justify-center">
              <p className="text-sm text-stone-400 inset-x-0 bottom-0 font-medium">
                {e.name}
              </p>
              <p className="text-sm text-stone-400 inset-x-0 bottom-0 font-medium">
                {e.sender}
              </p>
            </div>
            <button
              onClick={payHandler}
              className=" rounded-full p-5 bg-icon text-black w-24 h-full"
            >
              Pay
            </button>
          </div>
        ))
      )}

      {paytoggle && (
        <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          <p className="cursor-pointer" onClick={() => setPaytoggle(false)}>
            close
          </p>
          <Pay />
        </div>
      )}

      {reqtoggle && (
        <div className="h-full absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          {/* <p className="cursor-pointer" onClick={() => setPaytoggle(false)}>
              close
            </p> */}
          <div className="flex flex-col justify-between w-1/4 h-2/4 bg-boxbg rounded-md p-5 border-2 border-stone-400">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="UPI ID"
                onChange={(e) => setUpi(e.target.value)}
                className="p-4 bg-neutral-700 outline-none rounded-md"
              />
              <input
                type="number"
                placeholder="Amount INR"
                onChange={(e) => setAmount(e.target.value)}
                className="p-4 bg-neutral-700 outline-none rounded-md"
              />
              <input
                    type="text"
                    placeholder="Ex: groccery,snacks,fun"
                    onChange={(e) => setKeyword(e.target.value)}
                    className='p-4 bg-neutral-700 outline-none rounded-md'
                />
            </div>
            <div className="flex gap-4">
              <button
                onClick={reqcloseHandler}
                className="w-full bg-blue-900 p-4 rounded-full"
              >
                cancel
              </button>
              <button
                onClick={reqHandler}
                className="w-full bg-fadeBlue p-4 rounded-full"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reqpay;
