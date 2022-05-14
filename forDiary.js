    $(document).ready(() => {
        console.log(1);
        $('head').append('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito&family=Raleway&display=swap" rel="stylesheet"><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><script defer src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>');
        $('.singlePost:gt(3)').attr('data-aos', 'fade-up');
        $('body').append('<script>let seconds=0;function aosTurnOn(){try{AOS.init()}catch(n){setTimeout(aosTurnOn,seconds+=200)}}aosTurnOn();<\/script>');
    });
