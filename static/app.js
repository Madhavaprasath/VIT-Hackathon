class Chatbox {
    constructor() {
        this.args={
            openButton:document.querySelector('.chatbox__button'),
            chatBox:document.querySelector('.chatbox__support'),
            sendButton:document.querySelector('.send__button')
        }
    
    this.state=false;
    this.messages=[];

    }
    display(){
        const{openButton,chatBox,sendButton}=this.args;
        openButton.addEventListener('click',()=>this.toggleState(chatBox))
        sendButton.addEventListener('click',()=>this.onSendButton(chatBox))
        const node=chatBox.querySelector('input');
        node.addEventListener('kepress',(event)=>{
            if(event.keycode===13){
                this.onSendButton(chatBox)
            }
        })

    }

    toggleState(chatbox){
        this.state=!this.state;
        if(this.state){
            chatbox.classList.add('chatbox--active')
        }else{
            chatbox.classList.remove('chatbox--active')
        }
    }
    
    onSendButton(chatbox){
        var textField=chatbox.querySelector('input');
        let text1=textField.value;
        if(text1==''){
            return;
        }
        let msg1={name:"user",message:text1}
        this.messages.push(msg1);
        fetch($SCRIPT_ROOT+'/predict',{
            method:'POST',
            body:JSON.stringify({message:text1}),
            mode:'cors',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(r=>r.json())
        .then(r=>{
            let msg2={name:"macros",message:r.answer};
            this.messages.push(msg2);
            this.render(chatbox);
            this.updateChatText(chatbox);
            textField.value='';
        }).catch((error)=>{
            console.log('error',error);
            this.updateChatText(chatbox);
            textField.value='';
        });

    }
    updateChatText(chatbox){
    var html='';
    this.messages.slice().reverse().forEach(function(item,index){
    if(item.name==='macros'){
        html+='<div class="messages__item messages__item--visitor">'+item.message+'</div>'
    }else{
        html+='<div class="messages__item messages__item--operator">'+item.message+'</div>'
    }
    });

    const chatmessage=chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML=html;
    }
}
const chatBox=new Chatbox();
chatBox.display();