import React, { Component } from 'react'
import fetchJsonp from 'fetch-jsonp'
import './App.css'

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange() {
    this.props.onUserInput(
      this.hashtagTextInput.value
    )
  }
  render() {
    return (
      <form className="topbar">
        <input type="text" 
          placeholder="Search..." 
          value={this.props.hashtagTextInput} 
          ref={(input) => this.hashtagTextInput = input}
          onChange={this.handleChange}
          />        
      </form>
    )
  }  
}
class ImageContainer extends Component {
  render() {
    return <div className="square"><div className="content"><div className="table"><div className="table-cell"><img src={this.props.src} alt="" className="responsive" /></div></div></div></div>
  }
}
class ImagesGrid extends Component {
  render() {
    var images = []
    var i=0
    this.props.flickr_images.forEach(function(item) {
      images.push(<ImageContainer src={item.media.m} key={"_" + Number(i++)} />)  
    }) 
    return (
      <div className="row">{images}</div>
    )
  }
}
class FilterableImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtagTextInput: '',
      flickr_images: []
    }
    this.handleUserInput = this.handleUserInput.bind(this);
  }
  handleUserInput(hashtagText) {
    // load then change the state
    this.setState({
      hashtagTextInput: hashtagText,
      flickr_images: this.state.flickr_images  
    })
    var self = this
    var result = fetchJsonp('http://www.flickr.com/services/feeds/photos_public.gne?format=json&tags='+this.state.hashtagTextInput, {
      jsonpCallback: 'jsoncallback',
      timeout: 3000
    })
    result.then(function(response) {
      return response.json()
    }).then(function(json) {
      var items = json.items
      if(items.length>0)
      {
        self.setState({
          flickr_images: items
        })
      }
    }).catch(function(err) {
      console.log('parsing failed', err)
    })      
  }
  render() {
    return (
      <div>
        <SearchBar hashtagTextInput={this.state.hashtagTextInput} onUserInput={this.handleUserInput}/>
        <ImagesGrid flickr_images={this.state.flickr_images}/>
      </div>
    )
  }
}
class App extends Component {
  render() {
    return (
      <FilterableImages  />
    )
  }
}

export default App;