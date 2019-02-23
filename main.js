Vue.component("product-review", {
  template: `
     <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
      <b>Please correct the following error(s)</b>
      <ul>
      <li v-for="error in errors">{{ error }}</li>
      </ul>
      </p>


      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      
     <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
      
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        this.$emit("review-submitted", productReview);
        (this.name = null), (this.review = null), (this.rating = null), (this.recommend = null);
      } else {
        if (!this.name) this.errors.push("Name required");
        if (!this.review) this.errors.push("Review required");
        if (!this.rating) this.errors.push("Rating required");
        if (!this.recommend) this.errors.push("Recommendation required.");
      }
    }
  }
});

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
        <div class="product-image">
          <img v-bind:src="image" :alt="altText" />
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <a :href="link" target="blank">More products like this</a>
          <p v-if="inStock">In Stock</p>
          <!-- <p><span v-else="onSale">{{ saleMsg }}</span></p> -->
          <!-- <p v-if="inStock">In Stock</p> -->
          <!-- <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out</p> -->
          <p v-else
          :class="{ outOfStock: !inStock }">Out of Stock</p>
          <p>{{ sale }}</p>
          <p>Shipping: {{ shipping }}</p>
          <product-details :details="details"></product-details>
         

          <div
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)"
          >yo</div>

          <div v-for="size in sizes" :key="size.sizeId">
            <p>{{ size.size }}</p>
          </div>

          <button v-on:click="addToCart" :disabled="!inStock"
          :class="{ disabledButton: !inStock }">Add to Cart</button>

          <button @click="removeFromCart">Remove from Cart</button>

          <div>
          <h2>Reviews</h2>
          <p v-if="!reviews.length">There are no review yet.</p>
          <ul>
          <li v-for="review in reviews">
          <p>{{review.name}}</p>
          <p>{{review.rating}}</p>
          <p>{{review.review}}</p>
          
          </li>
          </ul>
          </div>

          <product-review @review-submitted="addReview"></product-review>
         
        </div>
      </div>
  `,
  data() {
    return {
      brand: "Vue mastery",
      product: "Socks",
      selectedVariant: 0,
      onSale: true,
      link:
        "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
      inventory: 9,
      onSale: true,
      altText: "a pair of socks",
      details: ["80% cotton", "20% polyster", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green.png",
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue.png",
          variantQuantity: 10
        }
      ],
      sizes: [
        {
          sizeId: "small",
          size: "small"
        },
        {
          sizeId: "medium",
          size: "medium"
        },
        {
          sizeId: "large",
          size: "large"
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart: function() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateProduct: function(index) {
      this.selectedVariant = index;
      // console.log(index);
    },
    removeFromCart: function() {
      //   if (this.cart.length == 0) {
      //     return;
      // } else if (this.cart.length >= 1) {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    }
  },
  computed: {
    title() {
      return this.brand + "" + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + "" + this.product + " are on sale!";
      } else {
        return this.brand + "" + this.product + " are not on sale!";
      }
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return "2.99";
      }
    }
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (let i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
