import React, {Component} from 'react'
import './ProductCard.css'
import axios from 'axios';
import {BACKEND} from '../config';
import {Alert} from 'react-bootstrap';
import { Link} from "react-router-dom";
import { Button } from "reactstrap";

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg : "",
        }
    }

    // onGetTrends = (e) => this.props.history.push("/graphs");
    onDelete = (e)=>{
        const user = {
            email : localStorage.getItem('email'),
            name : localStorage.getItem('name'),
            product_id : this.props.product.product_id,
        };

        (async()=>{
            const res_data = await axios
            .post( BACKEND + '/products/deleteproduct', user)
            .then(res => res.data)
            .catch(err => console.log("failed to delete product"));


            if(res_data.success === true){
                this.props.onDeleteHandle(true);
            }
            else{
                this.setState({
                    msg : res_data.msg,
                })
            }
        })();
    }

    onRecommend = (e) =>{
        this.props.onRecommendHandle(this.props.product.product_id);
    
    }

    onGetTrends = (e)=>{
        const user = {
            email : localStorage.getItem('email'),
            name : localStorage.getItem('name'),
            product_id : this.props.product.product_id,
        };
        console.log("HI," + user.product_id);
    }

    onClose = (e) =>{
        this.setState({
            msg : "",
        });
    }


    render(){
        return (
        
            <div className="container-fluid">

                { this.state.msg ? <Alert variant="danger" onClose={this.onClose} dismissible>
                                    <p>{this.state.msg.toUpperCase()}</p>
                                </Alert> : "" }
                <div className="row">
                    <div className="col-12 mt-3">
                        <div className="card">
                            <div className="card-horizontal">
                                <div className="img-square-wrapper">
                                    <img className="" src={this.props.product.productImage} alt="product"/>
                                </div>
                                <div className="card-body">
                                    <h4 className="card-title">{this.props.product.productName}</h4>
                                    <p className="card-text">Actual Price    - {this.props.product.productWebsite === "www.ebay.com" || this.props.product.productWebsite === "www.amazon.com"  ? "$" : "₹"}{this.props.product.productPrice}</p>
                                    <p className="card-text">Threshold Price - {this.props.product.productWebsite === "www.ebay.com" || this.props.product.productWebsite === "www.amazon.com"  ? "$" : "₹"}{this.props.product.thresholdPrice}</p>
                                    <p className="card-text">Product Website - {this.props.product.productWebsite}</p>
                                    <p className="card-text">Know More <a href={this.props.product.productURL}>Product URL</a></p>
                                    <h4>Notification - {this.props.product.isThresholdReached ? "SENT" : "PENDING" }</h4>
                                    
                                    <button onClick={this.onRecommend} style={{width: 'auto'}}className="btn btn-outline-success btn-md">Get Recommendation</button>
                                    <button onClick={this.onDelete} style={{width: 'auto'}} className="btn btn-outline-danger btn-md">Delete</button>
                                    <Link to={{
                                         pathname: `/graphs/${this.props.product.product_id}`,
                                        }}
                                    >
                                    <Button style={{width: 'auto'}} className="btn btn-outline-success btn-md">
                                    <span>Get trends</span>
                                    </Button>
                                    </Link>

                                    <Link to={{
                                         pathname: `/products/editThreshold/${this.props.product.product_id}`,
                                         state : {
                                            productURL : this.props.product.productURL,
                                            thresholdPrice : this.props.product.thresholdPrice,
                                         },
                                        }}
                                    >
                                    <Button style={{width: 'auto'}} className="btn btn-outline-success btn-md">
                                    <span>Edit Threshold Price</span>
                                    </Button>
                                    </Link>
                                    {/* <button onClick ={this.onGetTrends} className="btn btn-outline-success btn-md float-right">Get Price Trends</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    
}
export default ProductCard;
