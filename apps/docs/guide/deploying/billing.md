# Billing system

::: warning
This is still under development and will be available in a future release.
:::

The deployment of an application is done through a `ValidatorNodeProvider` smart contract.

The contract defines an ERC-20 token which is accepted as payment and the price of application execution per unit of time (second). In the current design, the price is fixed, and cannot be changed by the validator.

During the deployment of the application, the developer can choose the amount of time he wants to pre-fund the execution of its node, in seconds. That determines the initial token cost, which can be calculated by calling the `cost` view function of the selected `ValidatorNodeProvider` contract. The pre-fund can also be zero, which will register the application, but will not immediately run a node for it.

After an application is deployed, it can be funded by anyone by calling the `extendRunway` function of the `ValidatorNodeProvider`, specifying the application to be funded and the amount of time.

Before funding an application, either during deployment or later, the user must approve the `ValidatorNodeProvider` payee to spend the tokens on his behalf. This is done by calling the `approve` function of the ERC-20 token contract.

## Example

Suppose a `ValidatorNodeProvider` uses USDC as a payment token, and the price of application execution is set at 0.000033052248677249 USDC per second.

When the developer deploys the application, if he chooses to pre-pay for 1 week of execution, the cost will be roughly 19.99 USDC, which is the price per second times the number of seconds in a week (60 \* 60 \* 24 \* 7). He must approve that amount to the `ValidatorNodeProvider` payee before deploying the application.

If later someone chooses to extend the execution for two more weeks he must approve 39.98 USDC and call the `extendRunway` function of the `ValidatorNodeProvider` contract, specifying the application to be funded and the amount of time in seconds, 1,209,600 seconds in this case.
