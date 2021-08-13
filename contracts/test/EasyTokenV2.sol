pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";


contract EasyTokenV2 is Initializable, ERC777Upgradeable, OwnableUpgradeable {
    
    event TokensWrapped(
        address indexed sender,
        uint amount
    );

    event TokensUnwrapped(
        address indexed sender,
        uint amount
    );

    IERC20 public tokenAddress;    

    function initialize (address[] memory operatorAddress) public virtual initializer {
        OwnableUpgradeable.__Ownable_init();
        ERC777Upgradeable.__ERC777_init("Easy GeoDB Coin", "EASYGEO", operatorAddress);
    }

    function deposit(uint amount) external {
        IERC20 token = tokenAddress;
        address sender = msg.sender;

        require(address(token) != address(0), "Token address not set");
        token.transferFrom(sender, address(this), amount);

        ERC777Upgradeable._mint(sender, amount, "", "");

        emit TokensWrapped(sender, amount);
    }

    function withdraw(uint amount) external {
        IERC20 token = tokenAddress;
        address sender = msg.sender;

        ERC777Upgradeable._burn(sender, amount, "", "");

        require(address(token) != address(0), "Token address not set");
        token.transfer(sender, amount);

        emit TokensUnwrapped(sender, amount);
    }

    function setToken(IERC20 newToken) external onlyOwner {
        require(address(newToken) != address(0), "Address cannot be 0");
        tokenAddress = IERC20(newToken);
    }

    // Función para comprobar si se trata de la nueva versión en los tests
    function isNewVersion() external view returns (bool){
        return true;
    }
}