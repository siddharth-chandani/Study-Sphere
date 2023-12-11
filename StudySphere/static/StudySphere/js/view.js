function save(saveid,stat) {
    
    vid=parseInt(saveid.slice(4))
    fetch(`/save/${vid}`, {
        method: 'POST',
        body: JSON.stringify({
            save_status: stat
        })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (stat == 'save'){
                hrt='solid';
                now='unsave';
            }
            else{
                hrt='regular';
                now='save';
            }
            document.querySelector(`#${saveid}`).innerHTML=`<i class="fa-${hrt} fa-heart heart ${hrt}-heart"></i>`;
            document.querySelector(`#${saveid}`).value=now;
        });
}
