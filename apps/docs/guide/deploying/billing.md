# Billing system

The deployment of an application is done through a `PayableDAppFactory` smart contract.

The contract defines which ERC-20 token is accepted as payment and the price of application execution per unit of time (second). In the current design, the price is fixed, and cannot be changed by the validator.

During the deployment of the application, the developer can choose the amount of time he wants to pre-fund the execution of its node, in seconds. That determines the initial token cost, which can be calculated by calling the `cost` view method of the `PayableDAppFactory` contract. The pre-fund can be zero, which will register the application, but will not deploy a node for it.

After an application being deployed, it can be funded by anyone by calling the `extendRunway` method of the `PayableDAppFactory`, specifying the application to be funded and the amount of time. Again, the token cost can be calculated by calling the `cost` view method of the `PayableDAppFactory` contract.

Before funding an application, either during deployment or later, the user must approve the `PayableDAppFactory payee` to spend the tokens on his behalf. This is done by calling the `approve` method of the ERC-20 token contract.

## Example

Suppose a `PayableDAppFactory` uses `USDC` as a payment token, and the price of application execution is set at `0.000033052248677249 USDC` per second.

When the developer deploys the application, if he chooses to pre-pay for 1 week of execution, the cost will be roughly 19.99 USDC, which is the price per second times the number of seconds in a week (`60 * 60 * 24 * 7`). He must approve that amount to the `PayableDAppFactory` payee before deploying the application.

If later someone chooses to extend the execution for two more weeks he must approve 39.98 USDC and call the `extendRunway` method of the `PayableDAppFactory` contract, specifying the application to be funded and the amount of time in seconds, `1209600` seconds in this case.
