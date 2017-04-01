import React from 'react';
import { ScrollView, StyleSheet, Image, View, Platform } from 'react-native';
import base64 from 'base-64';

var Canvas = require('../components/Canvas');
var ws;

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      myname: 'Android-Client',
      status: 'Not Connected',
      connected: false,
      canvas: null,
      base64Image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg=='
    }
  }

  static route = {
    navigationBar: {
      title: 'Huddly Video Feed', 
    },
  };

  componentDidMount() {
    this.ws = new WebSocket('ws://128.39.80.161:5001/');
    console.log('COMPONENT MOUNTED, CALLING RENDER ');
    
    this.ws.onopen = () => {  // connection opened
      console.log('Connected to the WS.');
      this.setState({
        status: 'Connected to WS'
      });
    };
    
    this.ws.onmessage = (e) => {
      //TODO: wait for re-rendering until the whole image is decoded and displayed before you proceed with the next one
      var uint8Arr = new Uint8Array(e.data);
      var str = String.fromCharCode.apply(null, uint8Arr);
      var base64String = base64.encode(str);
      
      var newImageFrame = 'data:image/png;base64,' + base64String;
      this.setState({
        base64Image: newImageFrame
      });

      if(Platform.OS === 'tt') {
        //var canvas = this.state.canvas;
        console.log('Canvas is ', canvas);
        var context = this.state.context;
        var image = new Image;
        image.src = this.state.base64Image;
        img.onload = function () {
          context.drawImage(this, 0, 0, 200, 200);
        };
      }
    };
  }
  renderCanvas(canvas) {
    alert('Drawing Line!'); 
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(300,150);
    ctx.stroke();
    alert('Line Drawn');
  }
  render() {
    return (
      <View style={styles.imageContainer}>
        { Platform.OS === 'ios' ? 
          <Image style={styles.base64} source={{uri: this.state.base64Image, scale: 3}}  />
        : null }
        { Platform.OS === 'android' ? 
          <Canvas
            context={{message: 'Video Stream!'}}
            render={this.renderCanvas}
            style={{height: 200, width: 200}}
          />
        : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  base64: {
    flex: 1,
    height:50 ,
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1
  }
});
