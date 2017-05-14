/**
 * Created by thomas on 11/05/17.
 */

class ObjectIdTester {

    static isValid(_id){
        return _id.match(/^[0-9a-fA-F]{24}$/) != null
    }
}

module.exports = ObjectIdTester;