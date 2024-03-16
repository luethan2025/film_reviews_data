# Restaurant Reviews Dataset
This command-line tool curates a list of film reviews. You can build your dataset by prompting the URLs of several films found on letterboxd.com.

## Getting Started
To use this tool, you will need [Node.js](https://nodejs.org/en), which you should install on your machine beforehand. <br>

Clone this repository to your machine:
```shell
> git clone https://github.com/luethan2025/film_reviews_data.git
```
Now install the project's dependencies and configure Puppeteer by 'cd'-ing into the root of this project and running the command:
```shell
> sh bin/scripts/setup.sh
```

# Usage
Once all dependencies have been installed and Puppeteer has been properly configured, you can now use create your dataset.
```
Usage: scraper [options]

Options:
  -V, --version         output the version number
  --append <boolean>    append to destination file (default: false)
  --url <string>        URL to film on letterboxd.com
  --directory <string>  destination directory (default: "./data/")
  --filename <string>   destination file (default: "reviews.txt")
  -h, --help            display help for command
```
At minimum you must at least set the url argument to successfully run the program. The dataset will be found in `./data/reviews.txt` by default, however, if you set the directory or the filename argument the dataset will be found there instead.

# Technologies
Pixiv Data is built using [Node.js](https://nodejs.org/en) and the [Puppeteer API](https://github.com/puppeteer/puppeteer).
