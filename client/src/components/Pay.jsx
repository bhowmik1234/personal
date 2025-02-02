import React, { useState, useEffect } from 'react'
import "../index.css";
import axios from 'axios';
import { ConnectWallet, useAddress, useContract, useTransferToken } from '@thirdweb-dev/react';
import Moralis from 'moralis';
import api from "../utils/api.js"


const UPI = () => {
    const [upi, setUpi] = useState("");
    const [option, setOption] = useState("");
    const [amount, setAmount] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [metamaskID, setMetamaskId] = useState();
    const address = useAddress();
    const [USDC, setUSDC] = useState('');
    const [DAI, setDAI] = useState('');
    
    const walletAddress = useAddress();

    const { contract: usdcToken } = useContract('0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8');
    const {
        mutateAsync: transferUSDC,
        isLoading: loadingTransferUSDC,
        error: usdcError,
    } = useTransferToken(usdcToken);
    const { contract: daiToken } = useContract('0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357');
    const {
        mutateAsync: transferDAI,
        isLoading: loadingTransferDAI,
        error: daiError,
    } = useTransferToken(daiToken);

    useEffect(() => {
        const init1 = async () => {
            try {
                await Moralis.start({
                    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijc0MzU1NDE4LTZmNTUtNGRiZi04M2E5LTg0YmVmMWU2ZTg3ZSIsIm9yZ0lkIjoiMzk4MDY1IiwidXNlcklkIjoiNDA5MDI2IiwidHlwZUlkIjoiNmNiZGM1ZWItMTE0MS00Nzg4LWExZDItM2FkZjk3MWI2MzA0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTk1MDI5NjAsImV4cCI6NDg3NTI2Mjk2MH0.AJXjaSjXiJSpmYFfjFwkbK06cEcMdjHzq3b1fu3PHwQ"
                });

                const response = await Moralis.EvmApi.token.getTokenPrice({
                    "chain": "0x1",
                    "include": "percent_change",
                    "exchange": "uniswapv3",
                    "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                });

                console.log(response.raw.usdPrice);
                console.log('Before', USDC);
                setUSDC(response.raw.usdPrice);
                console.log('after', USDC);

                const resp = await Moralis.EvmApi.token.getTokenPrice({
                    "chain": "0x1",
                    "include": "percent_change",
                    "exchange": "uniswapv3",
                    "address": "0x6b175474e89094c44da98b954eedeac495271d0f"
                });

                console.log(resp.raw);
                setDAI(resp.raw.usdPrice);
            } catch (e) {
                console.error(e);
            }
        }
        init1();
    }, [])

    const payementHandler = async () => {
        try {
            const response = await api.post("/auth/fetchdetail", { 'waddr': address });
    
            if (response.data === 'no') {
                alert('Your wallet address is not linked!');
                return;
            }
    
            const userDetailsResponse = await api.post("/auth/fetchdetail", { email: "twelve@gmail.com" });
            const details = userDetailsResponse.data.user;
            setMetamaskId(details.metamaskId);
    
            if (address !== details.metamaskId) {
                alert('Wallet address not linked with your UPI, Check your wallet address');
                return;
            }
    
            if (!amount || !option || !upi) {
                alert("Missing fields!");
                return;
            }
    
            const receiverResponse = await api.post("/auth/fetchdetail", { upi: upi });
            const receiver = receiverResponse.data.data.metamaskId;
            console.log("rec", receiverResponse);
    
            let val, mtm, total, transferFunction;
            if (option === 'USDC') {
                val = ((amount / 83) * Number(USDC).toFixed(2));
                mtm = (0.2 * val).toFixed(2);
                total = (Number(val) + Number(mtm)).toFixed(2);
                transferFunction = transferUSDC;
            } else if (option === 'DAI') {
                val = ((amount / 83) * Number(DAI).toFixed(2));
                mtm = (0.2 * val).toFixed(2);
                total = (Number(val) + Number(mtm)).toFixed(2);
                transferFunction = transferDAI;
            } else {
                alert("Invalid payment option!");
                return;
            }
    
            alert(`Pay: ${val}\nMTM Fee: ${mtm}\nTotal: ${total}`);
            
            console.log("rec", receiver);
            // const rmc="0x6ad330dd68BeAF54cf4ACd311d91991F8Faa94E9";
            await transferFunction({
                to: receiver,
                amount: total,
            });
    
            const date = new Date().toLocaleDateString();
            await axios.post("http://localhost:5550/pay/paymentWrite", {
                date: date,
                to: upi,
                amt: amount,
                sender: walletAddress,
                keyword: keyword,
                coin: option,
            });
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className='bg-boxbg flex flex-col justify-between w-1/4 h-3/4 rounded-lg p-5 mt-20 border'>
            <ConnectWallet />
            <div className='flex flex-col gap-2'>
                <div className='inline'>
                    <button onClick={() => setOption('USDC')} className='mr-5 rounded-full w-1/4 p-3 bg-green-500'>USDC</button>
                    <button onClick={() => setOption('DAI')} className='rounded-full w-1/4 p-3 bg-orange-500'>DAI</button>
                </div>

                <input
                    type="text"
                    placeholder="UPI ID"
                    onChange={(e) => setUpi(e.target.value)}
                    className='p-4 bg-neutral-700 outline-none rounded-md'
                />
                <input
                    type="number"
                    placeholder="Amount INR"
                    onChange={(e) => setAmount(e.target.value)}
                    className='p-4 bg-neutral-700 outline-none rounded-md'
                />
                <input
                    type="text"
                    placeholder="Ex: groccery,snacks,fun"
                    onChange={(e) => setKeyword(e.target.value)}
                    className='p-4 bg-neutral-700 outline-none rounded-md'
                />

            </div>
            <div className='flex flex-col items-center'>
                <button onClick={payementHandler} className='rounded-full w-full p-3 bg-fadeBlue'>Pay</button>
                <p className='text-sm mt-3 font-thin'> powered by Us</p>
            </div>
        </div>
    )
}

export default UPI