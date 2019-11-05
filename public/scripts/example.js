var elencoMessaggi = [
    {author:"giuseppe", text: "hgvsvsvavsa"},
    {author:"giuseppe", text: "fddsffds"},
    {author:"peppino", text: "hgvsvxzczcsvavsa"},
    {author:"homer", text: "kugig"}
]

class CommentBox extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data : []
            }
    }

handleCommentSubmit(comment){
  //  this.onCommentSubmit({...data, comment})
  $.ajax({
    url: this.props.url,
    dataType: 'json',
    type:'POST',
    data: comment,
    success: function(data) {
      this.setState({data: data});
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
}

loadCommentsFromServer(){
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      }
    


componentDidMount(){
this.loadCommentsFromServer();
setInterval(this.loadCommentsFromServer.bind(this),this.props.pollInterval);
}

    render(){
        return(
            <div className = "commentBox">
               <h1>Lista commenti</h1>
               <CommentList data = {this.state.data} />
               <CommentForm onCommentSubmit = {this.handleCommentSubmit.bind(this)} />
            </div>
        );
    }
};

class CommentList extends React.Component{


    
    render(){

        var risultatoMappaCommenti = this.props.data.map(
        (msg,index) => {
            return (
            <Comment className = "comment" key = {index}  author = {msg.author}>{msg.text}</Comment>
            );
          } 
        );
   
        return(
            <div className = "commentBox">
                {risultatoMappaCommenti}
       
           </div>
        );
    }
}



class CommentForm extends React.Component{

    handleSubmit(event) {
        event.preventDefault(); //impedisce comportamento default
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = ReactDOM.findDOMNode(this.refs.text).value;
        if (!text || !author) {
            return;
        }
        console.log('server');
        this.props.onCommentSubmit({ author:author, text:text });
        ReactDOM.findDOMNode(this.refs.author).value = '';
        ReactDOM.findDOMNode(this.refs.text).value = '';
        return;
    };
    render(){
        return(
            <form className = "commentForm" onSubmit={this.handleSubmit.bind(this)} > 
                <input type ="text" placeholder="author" ref ="author"/>
                <input type ="text" placeholder="text" ref ="text"/>
                <input type ="submit"/>
            </form>
        );
    }
}

class Comment extends React.Component{

    rawMarkup(myMarkupString) {
        var md = new Remarkable();
        var rawMarkup = md.render(myMarkupString);
        return { __html: rawMarkup };
      }

    render(){

var md = new Remarkable();

        return(
            <div className = "content">
               <h2 className ="contentAuthor">{this.props.author}</h2>
                    <span dangerouslySetInnerHTML = {this.rawMarkup(this.props.children)}></span>
             </div>
        );
    }
}

ReactDOM.render(
	<CommentBox url ="/api/comments" pollInterval ="2000" />,
	document.getElementById('content')
);