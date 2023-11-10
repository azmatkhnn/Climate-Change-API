const PORT = process.env.PORT || 4000
const express =require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const app = express()
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/topic/climate-change/',
        base: ''
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/section/climate',
        base: ''
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: ''
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    },
    // {
    //     name: 'un',
    //     address: 'https://www.un.org/en/climatechange',
    //     base: ''

    // },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science-environment-24021772',
        base: 'https://www.bbc.com'
    },
    {
        name: 'thesun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'unicef',
        address: 'https://www.unicef.org/environment-and-climate-change',
        base: 'https://www.unicef.org'
    },
    {
        name: 'nasa',
        address: 'https://climate.nasa.gov/what-is-climate-change/',
        base:''
    },
    {
        name: 'downtoearth',
        address: 'https://www.downtoearth.org.in/climate-change',
        base: ''
    },
    {
        name: 'timesofindia',
        address: 'https://timesofindia.indiatimes.com/topic/climate-change',
        base: ''
    }
]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    })
})
app.get('/', (req,res) => {
    res.json('Welcome to my CLimate Change API')
})

app.get('/news', (req,res) => {
    res.json(articles)
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    // .then((response) => {
    //     const html = response.data
    //     // console.log(html)
    //     const $ = cheerio.load(html)

    //     $('a:contains("climate")', html).each(function () {
    //         const title = $(this).text()
    //         const url = $(this).attr('href')
    //         articles.push({
    //             title,
    //             url
    //         })
    //     })
    //     res.json(articles)
    // }).catch((err) => console.log(err))
})

app.get('/news/:newspaperId',  (req, res) => {
    const newspaperId = req.params.newspaperId
    
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    // console.log(newspaperAddress)
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const speceficArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            speceficArticles.push({
                title,
                url,
                source: newspaperId
            })
        })
        res.json(speceficArticles)
    }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`))