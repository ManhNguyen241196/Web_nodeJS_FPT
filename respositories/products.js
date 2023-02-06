const Repository =require('./respository');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util')

class ProductRepository extends Repository{
   async create(attrs){    // attrs được đưa vào là 1 object 
            attrs.id = this.randomId();

            const records = await this.getAll();  // records được xây dựng là 1 array
            records.push(attrs);
            await this.writeAll(records);

            return attrs
        }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }
}

module.exports = new ProductRepository('products.json');
