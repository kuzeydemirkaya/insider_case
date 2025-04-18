(() => {
    const endpoint = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const localStorageKey = "productCarouselData";

    const init = async () => {
        const productData = await fetchProductData();
        buildHTML(productData);
        buildCSS();
        setEvents();
    };

    const fetchProductData = async () => {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            return JSON.parse(storedData);
        }

        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            localStorage.setItem(localStorageKey, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Failed to fetch product data", error);
            return [];
        }
    };

    const buildHTML = (products) => {
        const html = `
            <div class="product-carousel">
                <h2>You Might Also Like</h2>
                <div class="carousel-container">
                    <button class="carousel-button left">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg> 
                    </button>
                    <div class="carousel-track-container">
                        <ul class="carousel-track">
                            ${products
                                .map(product => `
                                    <li class="carousel-item">
                                        <a href="${product.url}" target="_blank">
                                        <div class="image-wrapper">
                                            <img src="${product.img}" alt="${product.name}" />
                                            
                                        </div>
                                            <div class="new-product-card__information-box">
                                              <div class="new-product-card__information-box__title">
                                                <a href="${product.url}" target="_blank"><p class="product-name">${product.name}</p></a>
                                              </div>
                                              <div class="new-product-card__price">
                                                <div class="price__current-price">${product.price} TL</div>
                                                </div>
                                              </div>
                                        </a>
                                            <button class="favorite-button" data-id="${product.id}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                                                    <path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path>
                                                </svg>
                                            </button>
                                    </li>
                                `)
                                .join("")}
                        </ul>
                    </div>
                    <button class="carousel-button right rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242" class=""rotate-180"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                    </button>
                </div>
            </div>
        `;
        $(".product-detail").after(html);

        restoreFavorites();
    };

    const buildCSS = () => {
        const css = `
            .product-carousel {
                margin: 2px 0;
                font-family: Arial, sans-serif;
                background-color: #f4f5f7;

            }
            .product-carousel h2 {
                text-align: left;
                margin-bottom: 10px;
                font-size: 32px;
                font-weight: lighter;
                color: #29323b;
                padding-top: 15px;
                padding-bottom: 15px;
                margin-left: 11%;
            }
            .carousel-container {
                display: flex;
                align-items: center;
                position: relative;
                justify-content: center;
            }
            .carousel-track-container {
                overflow: hidden;
                width: 80%;
                display: block;
                margin-right: 30px;
                padding-bottom: 15px;
            }
            .carousel-track {
                display: flex;
                transition: transform 0.3s ease-in-out;
                padding-left: 20px;
            }
            .carousel-item {
                list-style: none;
                margin: 0 10px;
                text-align: center;
                position: relative;
            }
            .carousel-item img {
                max-width: 150px;
                height: auto;
                display: block;
                margin: 0 auto;
            }
            .carousel-button {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
            }
            .favorite-button {
                cursor: pointer;
                position: absolute;
                top: 9px;
                right: 15px;
                width: 31px;
                height: 30px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
                border: solid .5px #b6b7b9;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .favorite-button.favorited>svg>path {
                fill: #193db0;
                stroke: #193db0;
            }
            .new-product-card__information-box {
                display: flex;
                flex-direction: column;
                padding: 0 10px;
                background-color: white;
                font-family: 'Open Sans', sans-serif;
            }
            .product-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: initial;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-size: 14px;
                height: 40px;
                margin-top: 5px;
                text-align: -webkit-auto;
            }
            .new-product-card__information-box__title {
                padding-bottom: 60px;
                height: 70px;
            }
            .new-product-card__price {
                display: flex;
                align-items: flex-start;
                height: 32px;
                flex-direction: column;
            }
        `;
        $("<style>").addClass("carousel-style").html(css).appendTo("head");
    };

    const setEvents = () => {
        const track = $(".carousel-track");
        const items = $(".carousel-item");
        const leftButton = $(".carousel-button.left");
        const rightButton = $(".carousel-button.right");

        let currentIndex = 0;

        const updateTrackPosition = () => {
            const itemWidth = items.outerWidth(true);
            track.css("transform", `translateX(-${currentIndex * itemWidth}px)`);
        };

        leftButton.on("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateTrackPosition();
            }
        });

        rightButton.on("click", () => {
            if (currentIndex < items.length - 6.5) {
                currentIndex++;
                updateTrackPosition();
            }
        });

        $(".favorite-button").on("click", function () {
            const button = $(this);
            const productId = button.data("id");
            button.toggleClass("favorited");

            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            if (button.hasClass("favorited")) {
                favorites.push(productId);
            } else {
                const index = favorites.indexOf(productId);
                if (index !== -1) favorites.splice(index, 1);
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    };

    const restoreFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        favorites.forEach(id => {
            $(`.favorite-button[data-id='${id}']`).addClass("favorited");
        });
    };

    init();
})();
