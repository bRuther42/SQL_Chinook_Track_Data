document.querySelector('#addBtn').addEventListener('click',addTrackData);

function updateTrack()
{
    fetch('http://localhost:9999/track/')
    .then(res=> res.json())
    .then(json=>{

        const trackDiv = document.querySelector(`#tableDiv`);
        let inDiv = `
        <table class="trackTable" cellspacing=0>
        <thead><th>Track Name</th><th>Composer</th><th>Media Type</th><th>Milliseconds</th><th>Unit Price</th><th>Action</th>
        </thead><tbody>`;

        const mediaString = {1:'MPEG audio file', 2:'Protected AAC audio file', 3:'Protected MPEG-4 video file', 4:'Purchased AAC audio file', 5:'AAC audio file'};

        for(const trk of json)
        {
            inDiv += `
                <tr id="dataRow">
                <td class="hiddenID">${trk.TrackId}</td>
                <td>${trk.Name}</td>
                <td>${trk.Composer}</td>
                <td class="hoverArea">${trk.MediaTypeId}<span class="hoverText" contenteditable=false>${JSON.stringify(trk.MediaTypeId).replace(/1|2|3|4|5/g, match=> mediaString[match])}</span></td>
                <td>${trk.Milliseconds}</td>
                <td>${trk.UnitPrice}</td>
                <td id="btns"><button class="upBtn" contenteditable=false>Update</button><button class="deBtn" value=${trk.TrackId} contenteditable=false>Delete</button></td>
                </tr>
            `;
        }

        trackDiv.innerHTML = inDiv + `</tbody></table>`;
        const formTag = document.querySelector('form');

        let inForm = `
            <input name="Name" type="text" placeholder="Track Name">
            <input name="Composer" type="text" placeholder="Track Composer">
            <input list="mediatypes" name="MediaTypeId" type="text" placeholder="Select Media Type">
            <datalist id="mediatypes">
                <option value="1">MPEG audio file</option>
                <option value="2">Protected AAC audio file</option>
                <option value="3">Protected MPEG-4 video file</option>
                <option value="4">Purchased AAC audio file</option>
                <option value="5">AAC audio file</option>
            </datalist>
            <input name="Milliseconds" type="text" placeholder="Milliseconds">
            <input name="UnitPrice" type="text" placeholder="Unit Price">
        `;
        formTag.innerHTML = inForm;
        addEventListeners();
    });
}
updateTrack();

function addTrackData(event)
{
    event.preventDefault();
    const fd = new FormData(document.querySelector('form'));
    fetch('http://localhost:9999/track',{method:'post',body:fd})
    updateTrack();
}

function addEventListeners()
{
    const cells = document.querySelectorAll('td');
    for(const cell of cells)
    {
        cell.setAttribute('VALIGN','center');
        cell.addEventListener('dblclick',(e)=>
        e.target.parentElement.setAttribute('contenteditable',true));
    }

    const updateBtns = document.querySelectorAll('.upBtn');
    for(const btn of updateBtns)
    {
        btn.addEventListener('click',(e)=> edit(e.target));
    }

    const deleteBtns = document.querySelectorAll('.deBtn');
    for(const btn of deleteBtns)
    {
        btn.addEventListener('click',(e)=> deleteRow(e.target));
    }

}

function edit(e)
{
    const data = e.parentElement.parentElement.children;
    const trkID = data[0].innerText;
    let jsonData = {};
    jsonData['Name'] = data[1].innerText;
    jsonData['Composer'] = data[2].innerText;
    jsonData['MediaTypeId'] = data[3].innerText;
    jsonData['Milliseconds'] = data[4].innerText;
    jsonData['UnitPrice'] = data[5].innerText;
    jsonData = JSON.stringify(jsonData);
    console.dir(jsonData);
    fetch('http://localhost:9999/track/'+ trkID,
    {
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        method:'put',
        body:jsonData
    });
    updateTrack();
}

function deleteRow(e)
{
    console.log(e.value);
    fetch('http://localhost:9999/track/'+ e.value,{method:'delete'});
    updateTrack();
}

