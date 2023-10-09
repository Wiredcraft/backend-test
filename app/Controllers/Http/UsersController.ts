import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreValidator from 'App/Validators/Users/StoreValidator'

export default class UsersController {
  /**
   *
   * @returns a list of users with pagination metadata
   */
  public async index({ request, response }: HttpContextContract) {
    const { page } = request.qs() // Get pagination parameters

    const users = await User.query().paginate(page || 1, 50) // Use default pagination parameters if none are provided
    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    /**
     * Validate the request
     */
    await request.validate(StoreValidator)

    const payload = request.only(['name', 'date_of_birth', 'description'])

    const user = await User.create({
      address: JSON.stringify(request.input('address')),
      ...payload,
    })

    /**
     * @todo Internationalise response strings
     */
    return response.created({
      message: 'User created successfully',
      data: user,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await User.query().where('id', params.id).first()

    /**
     * return a 404 if no record found
     */
    response.abortIf(!user, 404)

    return response.ok({
      data: user,
    })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
