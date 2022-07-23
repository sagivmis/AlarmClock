/* eslint-disable react/style-prop-object */
import React from 'react'

const AdsController = () => {
    return (
        <div className='ads-controller'>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6712178159961444"
                crossOrigin="anonymous"></script>
            <ins className="adsbygoogle"
                style={{ display: 'inline-block', width: '360px', height: ' 800px' }}
                data-ad-client="ca-pub-6712178159961444"
                data-ad-slot="6015654874"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
            </script></div>
    )
}

export default AdsController