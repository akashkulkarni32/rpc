import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ServiceClientConstructor } from '@grpc/grpc-js';

const packageDefination = protoLoader.loadSync(path.join(__dirname, './a.proto'));
const grpcObject = grpc.loadPackageDefinition(packageDefination);

const PERSON : any[] = [];

//@ts-ignore
function addPerson(call,callback){
    let person = {
        name :call.request.name,
        age : call.request.age
    }
    PERSON.push(person);
    callback(null,person);
}
//@ts-ignore
function GetPersonByNameRequest(call,callback){
    let name = call.request.name;
    let person = PERSON.find((person) => person.name === name);
    if (person) {
        callback(null, person);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: 'Person not found'
        });
    }
}

const server =new grpc.Server();

server.addService((grpcObject.AddressBookService as ServiceClientConstructor).service, { addPerson: addPerson, GetPersonByNameRequest: GetPersonByNameRequest });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});