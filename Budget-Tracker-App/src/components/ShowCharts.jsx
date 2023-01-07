import React,{useState,useEffect,useContext} from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Auth } from '../context/AuthContext';
function ShowCharts() {
    const [transaction,setTransaction] = useState([])
    const {key} = useContext(Auth)
    async function getalltransaction(){
        const res = await fetch("http://127.0.0.1:8000/tracker/gettransactions/",{
            method:"POST",
            headers:{
                "content-type":"application/json",
                "Authorization":"token "+key
            },
        })
        const data = await res.json();
        if(data.status){

            for(let i = 0; i <= data.msg.length - 1; i++){
                setTransaction((x)=>[...x,{expensename:data.msg[i].expensename,cost:data.msg[i].cost}])
            }
        }
    }
    
    useEffect(()=>{
        getalltransaction();
    },[])
  return (
    <div style={{"display":"flex","justifyContent":"center","alignItems":"center"}}>
        <div style={{"display":"flex-col","justifyContent":"center","alignItems":"center"}}>
            <h1>Showing Visualization</h1>
            <LineChart width={600} height={300} data={transaction} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="cost" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="expensename" />
                <YAxis />
            </LineChart>
        </div>
    </div>
  )
}

export default ShowCharts