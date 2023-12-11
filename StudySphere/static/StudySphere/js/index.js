function clearNoti(){
    fetch('/noti', {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(result => {  
        console.log(result)
        // reset all noti..
        const popover = bootstrap.Popover.getOrCreateInstance('#unread') // Returns a Bootstrap popover instance
        popover.setContent({
        '.popover-body': 'No New Notification.'
        })
        document.getElementById('unread_no').innerHTML=0;
        
    });

}

function noti(){
    fetch('/noti', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result)
        // console.log(typeof(result))
        div=document.createElement('div')
        ul=document.createElement('ul')
        ul.className='list-group list-group-flush'
        for (const key in result) {
            if (Object.hasOwnProperty.call(result, key)) {
                
                li=document.createElement('li');
                li.className='list-group-item';
                li.innerHTML= result[key];
                ul.append(li)
            }
        }
        div.append(ul)
        btn=document.createElement('button')
        btn.className='btn btn-primary'
        btn.onclick=clearNoti
        btn.id='clearNoti'
        btn.innerHTML='Clear Noti(s).'
        div.append(btn)
        // console.log(val)
        const popover = bootstrap.Popover.getOrCreateInstance('#unread') // Returns a Bootstrap popover instance
        // setContent example
        popover.setContent({
        '.popover-header': 'New Notification(s)',
        '.popover-body': div
        })



    });
}