// initialize
window.onload = function () {
    // add action to the file input
    var input = document.getElementById('file');
    input.addEventListener('change', importImage);

    // add action to the encode button
    var encodeButton = document.getElementById('encode');
    encodeButton.addEventListener('click', encode);
}

var maxMessageSize = 1000;

// put image in the canvas and display it
var importImage = function (e) {
    var reader = new FileReader();

    reader.onload = function (event) {
        // set the preview
        document.getElementById('preview').style.display = 'block';
        document.getElementById('preview').src = event.target.result;

        // wipe all the fields clean
        document.getElementById('message').value = '';

        // read the data into the canvas element
        var img = new Image();
        img.onload = function () {
            var ctx = document.getElementById('canvas').getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
};

// encode the image and save it
var encode = function () {
    var message = document.getElementById('message').value;
    var output = document.getElementById('output');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');


    message = JSON.stringify({ 'text': message });

    // exit early if the message is too big for the image
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    if ((message.length + 1) * 16 > pixelCount * 4 * 0.75) {
        alert('Message is too big for the image.');
        return;
    }

    // exit early if the message is above an artificial limit
    if (message.length > maxMessageSize) {
        alert('Message is too big.');
        return;
    }

    // encode the encrypted message with the supplied password
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    encodeMessage(imgData.data, sjcl.hash.sha256.hash(""), message);
    ctx.putImageData(imgData, 0, 0);

    // view the new image
    alert('완료됬습니다. 최하단 이미지가 출력입니다.');

    output.src = canvas.toDataURL();

};