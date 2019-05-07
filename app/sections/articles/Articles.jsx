import "sections/articles/Articles.styl"

import { h, Component } from "preact";

import ajax from "ajax.js"
import Loading from "ui/Loading.jsx"

export default class Articles extends Component {
    constructor() {
        super();
        this.state = {
            loading: true
        }
        this.load()
    }

    load() {
        let that = this;
        ajax.request("GET", "https://daltontabservices.myhomework.space/v1/getPocketArticles.php", {}, data => {
            this.setState({
                loading: false,
                data: data.list.slice(0, 4)
            })
        })
    }

    render(props, state) {
        console.log(state)
        if (state.loading) {
            return <Loading section="stories" />
        } else {
            return <div class="articles-section">
                <div class="articles">
                    {state.data.map((element, i) => {
                        return <article>
                            <a href={element.url}><div class="article-image" style={`background-image: url(${element.image_src})`}></div></a>
                            <h4><a href={element.url}>{element.title}</a></h4>
                            <p>{element.excerpt}
                                <span class="small">Source: {element.domain}</span>
                            </p>
                        </article>
                    })}
                </div>
                <p class="attribution">Articles from Pocket</p>
                <p class="link"><a href="https://getpocket.com/explore/trending">More Trending Stories <i class="fa fa-chevron-right"></i></a></p>
            </div>
        }
    }
}