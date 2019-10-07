/**
 * API Response 규격
 * @class ApiResponse
 */
module.exports = class ApiResponse {
  /**
   *
   * @param { boolean } success - 성공여부
   * @param { string } message - 메시지
   * @param { any } data - 응답 데이터
   */
  constructor(success = true, message = null, data = null) {
    /**
     * Request 성공여부
     * @type boolean
     */
    this.success = success;

    /**
     * Response로 내보낼 메시지 (응답이 아님. 에러 메시지 같은걸로 쓰세요)
     * @type String
     */
    this.message = message;

    /**
     * 응답에 쓰일 실제 데이터
     * @type any
     */
    this.data = data;
  }
};
