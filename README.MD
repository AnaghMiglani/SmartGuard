docker run -it ilf > smartguard.log <br> python extract_bugs.py

### Backend Usage

The backend provides an endpoint `/api/save-code` to dynamically create Truffle projects. To save Solidity code as part of a Truffle project, send a POST request with the Solidity code to this endpoint. The project will be created in the `ilf/example/crowdsale` directory.