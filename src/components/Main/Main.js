import React from 'react'
import * as tf from '@tensorflow/tfjs';

export class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            images: "",
            message: ""
        }
        this.predicting = this.predicting.bind(this)
        this.model = undefined
      }

      async componentDidMount() {
        //   localStorage.setItem("model", JSON.stringify(require("./model/model.json")))
        // const handler = tfn.io.fileSystem([require("./model/model.json"), require("./model/weights.bin")]);
        this.model = await tf.loadLayersModel("https://calm-harbor-72858.herokuapp.com/model/model.json")
        // this.model = await tf.loadLayersModel(require("../../assets/model/model.json"))
      }

    imageHandler = (e) => {
        e.preventDefault();
        var file = window.document.querySelector("#rice").files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            this.setState({
                images: reader.result
            })
            }.bind(this);
    }

    handleWait = () =>{
        this.setState({message: "Please Wait"})
    }

    handleResult = (data) => {
        var max = 0
        var idx = 0
        const labels = {
            0: "healthy",
            1: "brown spot",
            2: "hispa",
            3: "leaf blast",
			4: "error"
			
        }
        var result = ""
		var info = ""
        for(var i = 0; i < data.length; i++) {
            if(data[i] > max) {
                max = data[i]
                idx = [i]
            }
        }
        max = max.toFixed(4)
        if (idx == 0){
            result = "Your rice is " + labels[idx] + " (" + max*100 + "%)"
        }else{
            result = "Disease: " + labels[idx] + " (" + max*100 + "%)"
			
			
			if(labels[idx] == "leaf blast") {
				result += " \r\n|\r|\n a disease of rice caused by the fungus Pyricularia oryae, characterized by elliptical leaf spots with reddish-brown margins, brownish lesions and neck rot of the fruiting panicles, and stunting of the plant.";
				result += " \n Remedy:";
				result += " \n Use a protectant fungicide so that the panicles is protected as it emerges from the boots. Because rice blast is a multiple cycle disease, fungicide applications to control leaf blast early in the season are generally ineffective in reducing the incidence of neck blast and yield losses.";
			}
			if(labels[idx] == "brown spot") {
				result += " \n Brown spot is caused by the fungus Cochliobolus miyabeanus. Also called Helminthosporium leaf spot, it is one of the most prevalent rice diseases in Louisiana. When C. miyabeanus attacks the rice plants at emergence, the resulting seedling blight causes sparse or inadequate stands and weakened plants";
				result += " \n \n Remedy:";
				result += " \n\n The disease develops largely in areas with high humidity and on crops planted in nutrient deficient soil. This infection occurs when leaves remain wet for 8 to 24 hours. It most often happens when the crop is planted from infected seeds or on volunteer crops, and when weeds or debris from previous crops is present. Practice good sanitation in your fields to help avoid brown leaf spot of rice and plant disease-resistant varieties. 1 You may also fertilize the crop, although this can take several growing seasons to work completely. Take a soil test to learn exactly which nutrients are missing in the field. Incorporate them into the soil and monitor them regularly. You can soak seeds before planting to limit the fungal disease. Soak in hot water 10 to 12 minutes or in cold water for eight hours overnight. Treat seeds with a fungicide if you’re having problems with rice with brown leaf spots. Now that you’ve learned what is rice brown leaf spot and how to properly treat the disease, you may increase the production and the quality of your crop.";
			}
			if(labels[idx] == "hispa") {
				result += " \n Rice hispa scrapes the upper surface of leaf blades leaving only the lower epidermis. It also tunnels through the leaf tissues. When damage is severe, plants become less vigorous.";
				result += " \n Remedy:";
				result += " \n Avoid over fertilizing the field.";
result += "Close plant spacing results in greater leaf densities that can tolerate higher hispa numbers.";
result += "Leaf tip containing blotch mines should be destroyed.";
result += "Manual collection and killing of beetles – hand nets.";
result += "To prevent egg laying of the pests, the shoot tips can be cut.";
			}
			if(idx == 4) {
				result = "ERROR: No Classification " + labels[idx] ;
			}
			
        }


        this.setState({message: result})
    }

    async predicting(){
        this.handleWait()

        const image = window.document.getElementsByTagName('img')[1]
        const img = tf.browser.fromPixels(image).resizeBilinear([224,224], false).mul(1./255.).expandDims(0)
        const prediction = this.model.predict(img);
        const result = await prediction.data()

        this.handleResult(result)
    }
    
    render(){
        return (
		
            <div className="content">
			
                <div className="item" >
                    <img className="icon" src={require("../../assets/icon.png")} />
                </div>
                <div className="item">
                    <h4>Select Your Image</h4>
                </div>
                <input required ref="file" type="file" name="images" accept="image/*" className="item upload" id="rice"   onChange={this.imageHandler}/>
				<div className="item btn" onClick={this.predicting}>Detect Rice Disease!</div>
                <div>{this.state.message}</div>
                <div>
                    <img src={this.state.images} className="item image"/>
                </div>
            </div>
        );
    }
}
// export default Main