import React,{useState,useContext, useEffect} from 'react';
import { Auth } from '../context/AuthContext';

function ShowTransaction() {
    const [select,setSelect] = useState()
    const [response,setResponse] = useState([])
    const [category,setCategory] = useState()
    const [expensename,setExpensename] = useState()
    const [error,setError] = useState({flag:false,msg:""})
    const [transaction,setTransaction] = useState()
    const [sum,setSum] = useState()
    const [cost,setCost] = useState();
    const [expensecat,setExpensecat] = useState([]);
    const {key} = useContext(Auth)

    let sum1 = 0;
    async function getTransactionByCategory(cat){
      const res = await fetch("http://127.0.0.1:8000/tracker/serachbycat/",{
        method:"POST",
        headers:{
              "content-type":"application/json",
              "Authorization":"token "+key
        },
        body:JSON.stringify({
            category:cat
        })
      });
      const data = await res.json();

      if(data.status){
        setResponse(data.msg);
        let sum1 = 0;
        for(let i = 0;i <= response.length-1; i++){
            sum1 = sum1 + parseInt(response[i].cost)
        }
        setSum(sum1)
      }else{
        setResponse([])
      }
    }

    function onchangeData(e){
        if(e.target.name === "category"){
          setCategory(e.target.value)
        }else if(e.target.name === "expensename"){
          setExpensename(e.target.value)
        }else if(e.target.name === "cost"){
          setCost(e.target.value)
        }else if(e.target.name === "allcategory"){
          setSelect(e.target.value)
          getTransactionByCategory(select)
        }
      }

    async function getalltransaction(){
        const res = await fetch("http://127.0.0.1:8000/tracker/gettransactions/",{
            method:"POST",
            headers:{
                "content-type":"application/json",
                "Authorization":"token "+key
            },
        })
        const data = await res.json();
        setResponse(data.msg)
        let sum1 = 0;
        for(let i = 0;i <= response.length-1; i++){
            sum1 = sum1 + parseInt(response[i].cost)
        }
        setSum(sum1)
    }

    async function getallcategory(){
      const res = await fetch("http://127.0.0.1:8000/tracker/getdistintransaction/",{
          method:"POST",
          headers:{
              "content-type":"application/json",
              "Authorization":"token "+key
          },
      })
      const data = await res.json();
      if(data.status){
        setExpensecat([...data.msg])
      }else{
        setExpensecat([])
      }

  }

    async function ondelete(id){
        const res = await fetch("http://127.0.0.1:8000/tracker/delete/",{
            method:"POST",
            headers:{
                "content-type":"application/json",
                "Authorization":"token "+key
            },
            body:JSON.stringify({
                transactionid:id
            })
        })
        const data = await res.json();
        console.log(data)
    }

    async function getThisTransaction(id){
        const res = await fetch("http://127.0.0.1:8000/tracker/getatransaction/",{
            method:"POST",
            headers:{
                "content-type":"application/json",
                "Authorization":"token "+key
            },
            body:JSON.stringify({
                transactionid:id
            })
        })
        const data = await res.json();
        const category1 = document.querySelector(".category");
        const expense1 = document.querySelector(".expense");
        const cost1 = document.querySelector(".cost");


        category1.value = data.msg[0].category;
        expense1.value = data.msg[0].expensename;
        cost1.value = data.msg[0].cost;
        setCategory(data.msg[0].category)
        setExpensename(data.msg[0].expensename)
        setCost(data.msg[0].cost);
        setTransaction(data.msg[0].transactionid)
    }

    async function onupdate(e){
        e.preventDefault();

        const res = await fetch("http://127.0.0.1:8000/tracker/updateATransaction/",{
            method:"POST",
            headers:{
                "content-type":"application/json",
                "Authorization":"token "+key
            },
            body:JSON.stringify({
                category:category,
                expensename:expensename,
                cost:cost,
                transactionid:transaction
            })
        })
        const data = await res.json();
        
        if(data.status){
            setError({
                flag:true,
                msg:"Item Updated Succefully Succefully..."
              })
              setTimeout(()=>{
                setError({flag:false,msg:""})
               },2000)
        }else{
            setError({
                flag:false,
                msg:"Failed to Update..."
            })

            setTimeout(()=>{
                setError({flag:false,msg:""})
            },2000)
        }
    }

    
    useEffect(()=>{
        getalltransaction();
        getallcategory()
    },[])
  return (
    <div className="container">
<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Update This Transaction</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <p className='error'>{error.flag ? <p style={{"color":"green"}}>{error.msg}</p> : <p style={{"color":"red"}}>{error.msg}</p>}</p>

      <form>
      <div className="mb-3">
      <label htmlFor="exampleInputEmail1" className="form-label">Enter Category</label>
      <input type="text" onChange={onchangeData} name="category" className="form-control category" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    </div>
    <div className="mb-3">
      <label htmlFor="exampleInputPassword1" className="form-label">Enter Expense Name</label>
      <input type="text" onChange={onchangeData} name="expensename" className="form-control expense" id="exampleInputPassword1"/>
    </div>
    <div className="mb-3">
      <label htmlFor="exampleInputPassword1" className="form-label">Enter Cost</label>
      <input type="text" onChange={onchangeData} name="cost" className="form-control cost" id="exampleInputPassword1"/>
    </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" className="btn btn-primary" onClick={onupdate}>Update</button>
      </div>
    </div>
  </div>
</div>
<div className="container p-5">
  <p>Select Category</p>
<select className="form-select" name="allcategory" onChange={onchangeData} aria-label="Default select example">
  {
    expensecat.length > 0 ? expensecat.map((x,i)=>{
        return <option key={i} value={x.category}>{x.category}</option>
    }) : ""
  }
</select>
</div>
         <table className="table">
            <thead>
                <tr>
                <th scope="col">Category</th>
                <th scope="col">Expense Name</th>
                <th scope="col">Cost</th>
                <th scope="col">Date</th>
                <th scope="col">Customise</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                {
                    response.length > 0 ? response.map((data,i)=>{
                        return <tr key={i}>
                                    <td>{data.category}</td>
                                    <td>{data.expensename}</td>
                                    <td>{data.cost}</td>
                                    <td>{data.date}</td>
                                    <td><button type="button" onClick={()=> getThisTransaction(data.transactionid)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Edit
                                    </button></td>
                                    <td><button onClick={()=> ondelete(data.transactionid)} className="btn btn-primary">Delete</button></td>
                            </tr>
                    }) : ""
                }
                
            </tbody>
            </table>
            <h3>Total Expenditure - {sum ? sum : ""}</h3>
    </div>
  )
}

export default ShowTransaction