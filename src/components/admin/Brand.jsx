import React from 'react'
import {useEffect,useState} from 'react';
import axios from 'axios';
import {addBrand,setBrands,deleteBrand,editBrand} from '../../store/brandSlice'
import {useDispatch,useSelector} from 'react-redux'
import Moment from 'react-moment';
import AdminContainer from './AdminContainer';

function Brand(props) {

    const [bnd,setBnd]=useState({});
    const [loading,setLoding]=useState(false);
    const [editable,setEditable]=useState('');
    const [edit,setEdit]=useState({});
    const [added,setAdded]=useState(1);

    console.log("editable = ",editable);
    console.log('added',added)

    console.log(edit)
    const dispatch = useDispatch();
    const brands = useSelector(state => state.brands.brands)
    console.log(brands);

    useEffect(()=>{
         axios.get('/admin/brand-list')
        .then(response=>{
            const data=response.data.data
            if(response.data.status)
               dispatch(setBrands(data))
        })
        .catch(error=>{
            console.log(error);
        })
    },[])

    const submitHandler=e=>{
        e.preventDefault()
        setLoding(true);

        axios.post('/admin/add-brand',bnd)
        .then(response=>{
            const data=response.data.data
            console.log(response)
            setLoding(false);
            if(response.data.status)
            {
                dispatch(addBrand(data))
                setAdded(0)
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }

    const deleteHandler=(e,id)=>{
        e.preventDefault()
        axios.delete('admin/delete-brand/'+id)
        .then(response=>{
            console.log(response)
            dispatch(deleteBrand(id))
        })
        .catch(error=>{
            console.log(error)
        })
    }

    const editableHandler=(e,id)=>{
        e.preventDefault()
        editable?setEditable(''):setEditable(id)

    }
    
    const editHandler=(e,id)=>{
        e.preventDefault()
        axios.post('/admin/edit-brand/'+id,edit)
        .then(response=>{
            console.log(response)
            if(response.data.status){
                dispatch(editBrand({id,edit}))
                setEditable('')
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }

    return (
    
        <AdminContainer>
    <section className="content-header">
        <div className="container-fluid">
        <div className="row mb-2">
            <div className="col-sm-6">
            <h1>brands</h1>
            </div>
            <div className="col-sm-6">
                <button onClick={()=>{setAdded(1)}} type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal-default">
                    Add New
                </button>

{/* ================modal=================================== */}
               <div className="modal fade" id="modal-default">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        

                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Add brand</h3>
                            </div>
                            <form>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">brand Name</label>
                                        <input onChange={e=>setBnd({name:e.target.value})} type="text" className="form-control" placeholder="name" required/>
                                    </div>
                                </div>
                                <div className="card-footer">
                                <button type="submit" className="btn btn-primary toastrDefaultSuccess" onClick={e=>submitHandler(e)}>Submit</button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
{/* ================modal=================================== */}

            </div>
        </div>
        </div>
    </section>
   
    <section className="content">
        <div className="container-fluid">
        <div className="row">
            <div className="col-12">
            <div className="card">
                <div className="card-body">
                {
                    brands && (<table id="example2" className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>brand Id</th>
                        <th>brand Id</th>
                        <th>Created</th>
                        <th>Updated</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                           brands?.map(brand=>{
                                return <tr>
                                    <td>{brand.id}</td>
                                    {editable!==brand.id?<td>{brand.name}</td>:<div>
                                        <input type="text" placeholder={brand.name}  onChange={e=>setEdit({name:e.target.value})} />
                                        <button onClick={e=>editHandler(e,brand.id)} className="btn btn-dark">submit</button>
                                        </div>}
                                    <td> <Moment fromNow>{brand.created_at}</Moment></td>
                                    <td>
                                    <Moment fromNow>{brand.updated_at}</Moment> 
                                    <button style={{marginLeft:"30px"}} className='btn btn-danger' onClick={e=>deleteHandler(e,brand.id)}>delete</button>
                                    <button 
                                    style={{marginLeft:"30px"}} 
                                    className='btn btn-primary' 
                                    onClick={e=>editableHandler(e,brand.id)}>edit</button>
                                    </td>
                                    </tr>
                            })
                        }
                    

                    </tbody>
                    <tfoot>
                    <tr>
                        <th>brand Id</th>
                        <th>brand Id</th>
                        <th>Created</th>
                        <th>Updated</th>
                    </tr>
                    </tfoot>
                </table>)
                }
                </div>
            </div>
            </div>
            
        </div>
        
        </div>
    </section>
        </AdminContainer>

    )
}

export default Brand
